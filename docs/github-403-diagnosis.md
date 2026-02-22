# GitHub 访问 403 排查记录

## 结论
当前环境访问 GitHub 返回 403 的根因是：

1. 出站流量被强制走 HTTP/HTTPS 代理 `http://proxy:8080`。
2. 该代理（Envoy）在 `CONNECT github.com:443` 阶段直接返回 `403 Forbidden`，连接在 TLS 建立前就被拒绝。
3. 直连（不使用代理）同样不可达，说明环境本身不允许直接访问公网 443，必须依赖代理。

因此，这不是 GitHub 仓库地址或凭据问题，而是**网络策略/代理白名单限制**。

## 证据

### 1) 代理环境变量已开启
```bash
env | rg -i 'proxy|http|https|no_proxy'
```
可见：`HTTP_PROXY/HTTPS_PROXY/http_proxy/https_proxy=http://proxy:8080`。

### 2) 通过代理访问 GitHub，CONNECT 即 403
```bash
curl -vI https://github.com
```
关键输出：
- `Establish HTTP proxy tunnel to github.com:443`
- `< HTTP/1.1 403 Forbidden`
- `curl: (56) CONNECT tunnel failed, response 403`

### 3) 关闭代理后直连失败
```bash
HTTPS_PROXY= HTTP_PROXY= https_proxy= http_proxy= curl -I https://github.com
```
关键输出：
- `curl: (7) Failed to connect to github.com port 443`

### 4) 平台允许的特定入口可达（对照）
```bash
curl -I https://api.openai.com:18080/
```
返回 200/204，说明网络并非完全不可用，而是受限于代理策略和允许目标。

## 可执行建议

1. **最优解：放行代理策略**
   - 由平台管理员在 `proxy:8080`（Envoy）侧放行：
     - `github.com:443`
     - `raw.githubusercontent.com:443`
     - `codeload.github.com:443`
     - `api.github.com:443`

2. **临时替代**
   - 在可访问 GitHub 的网络中先打包源码（zip/tar）再上传到当前环境。
   - 或在内网镜像/制品库中同步该仓库后，从内网地址拉取。

3. **验证命令（放行后）**
```bash
curl -vI https://github.com
git ls-remote https://github.com/UxxHans/Rainbow-Cats-Personal-WeChat-MiniProgram.git
```
若成功，应不再出现 `CONNECT tunnel failed, response 403`。

## 复测结果（本次）

复测时间：2026-02-22（UTC）

执行命令：

```bash
curl -vI https://github.com
git ls-remote https://github.com/UxxHans/Rainbow-Cats-Personal-WeChat-MiniProgram.git
HTTPS_PROXY= HTTP_PROXY= https_proxy= http_proxy= curl -I https://github.com
```

结果：

- 代理路径仍在 CONNECT 阶段被 `proxy:8080` 返回 `HTTP/1.1 403 Forbidden`。
- `git ls-remote` 同样报错：`CONNECT tunnel failed, response 403`。
- 去代理后直连仍不可达（`Failed to connect to github.com port 443`）。

结论：当前环境依然**无法直接参考 GitHub 仓库**，必须等待代理白名单放行或改用内网镜像/离线包。
