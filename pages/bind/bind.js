const { getCurrentUser, getActiveSpace, createSpace, joinSpace } = require('../../utils/storage');

Page({
  data: {
    user: null,
    joinCode: ''
  },

  onShow() {
    const user = getCurrentUser();
    if (!user) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    const space = getActiveSpace();
    if (space) {
      wx.switchTab({ url: '/pages/home/home' });
      return;
    }
    this.setData({ user });
  },

  onCodeInput(e) {
    this.setData({ joinCode: e.detail.value });
  },

  handleCreate() {
    createSpace(this.data.user);
    wx.switchTab({ url: '/pages/home/home' });
  },

  handleJoin() {
    if (!this.data.joinCode.trim()) {
      wx.showToast({ title: '请输入绑定码', icon: 'none' });
      return;
    }
    const joined = joinSpace(this.data.joinCode, this.data.user);
    if (!joined) {
      wx.showToast({ title: '绑定码无效', icon: 'none' });
      return;
    }
    wx.switchTab({ url: '/pages/home/home' });
  }
});
