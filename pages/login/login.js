const { getCurrentUser, getActiveSpace, saveCurrentUser } = require('../../utils/storage');

Page({
  data: {
    user: null,
    hasSpace: false
  },

  onShow() {
    const user = getCurrentUser();
    const space = getActiveSpace();
    this.setData({ user, hasSpace: !!space });
  },

  handleWxLogin() {
    wx.getUserProfile({
      desc: '用于成长空间头像昵称展示',
      success: (res) => {
        const user = saveCurrentUser(res.userInfo);
        this.setData({ user, hasSpace: !!getActiveSpace() });
        if (getActiveSpace()) {
          wx.switchTab({ url: '/pages/home/home' });
        } else {
          wx.redirectTo({ url: '/pages/bind/bind' });
        }
      },
      fail: () => wx.showToast({ title: '授权后才能继续', icon: 'none' })
    });
  },

  goNext() {
    if (!this.data.user) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    if (this.data.hasSpace) {
      wx.switchTab({ url: '/pages/home/home' });
    } else {
      wx.redirectTo({ url: '/pages/bind/bind' });
    }
  }
});
