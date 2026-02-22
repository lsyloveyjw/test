const { getCurrentUser, getActiveSpace, saveCurrentUser } = require('../../utils/storage');

Page({
  data: {
    user: null
  },

  onShow() {
    const user = getCurrentUser();
    const space = getActiveSpace();
    if (user && space) {
      wx.switchTab({ url: '/pages/home/home' });
      return;
    }
    if (user && !space) {
      wx.redirectTo({ url: '/pages/bind/bind' });
      return;
    }
    this.setData({ user: null });
  },

  handleWxLogin() {
    wx.getUserProfile({
      desc: '用于成长空间头像昵称展示',
      success: (res) => {
        saveCurrentUser(res.userInfo);
        wx.redirectTo({ url: '/pages/bind/bind' });
      },
      fail: () => {
        wx.showToast({ title: '授权后才能继续', icon: 'none' });
      }
    });
  }
});
