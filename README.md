# 我们的成长系统（微信小程序）

情侣协作型打卡记事小程序，包含成长记录、争吵后修复记录、纪念日倒计时和关系温度分析。

## 功能

- 成长记录：按“我/TA + 分类 + 备注”记录日常进步
- 修复记录：争吵后修复过程沉淀（和解、复盘、共识）
- 纪念日倒计时：支持配置恋爱起始日与下个纪念日（MM-DD）
- 时间轴：成长记录/修复记录分栏查看
- 关系温度：综合近7天互动、修复行为、连续互动天数生成分数

## 目录

- `pages/home` 今日看板 + 录入
- `pages/history` 成长/修复时间轴
- `pages/stats` 关系温度与统计
- `utils/storage.js` 本地存储逻辑
- `utils/date.js` 日期与倒计时工具

## 使用

1. 微信开发者工具导入当前目录
2. 修改 `project.config.json` 中 `appid`
3. 运行并在首页先配置纪念日

## 常见问题（关键）

### 报错：`app.json 在项目根目录未找到`
这通常是**导入目录选错层级**导致的。

请确保你在微信开发者工具里导入的是**包含 `app.json` 的那个目录**，不是它的上级目录。

正确目录应至少包含：

- `app.json`
- `app.js`
- `project.config.json`
- `pages/`

如果你必须从上级目录导入，请把 `project.config.json` 的 `miniprogramRoot` 改为实际子目录，例如：

```json
{
  "miniprogramRoot": "./test-codex-create-punch-clock-wechat-mini-program/"
}
```

并确认该子目录内存在 `app.json`。
