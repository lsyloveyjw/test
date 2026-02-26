const { getCurrentUser, getActiveSpace, getMemberPanels, leaveCurrentSpace } = require('../../utils/storage');

Page({
  data: {
    user: null,
    space: null,
    panels: [],
    periods: ['当天', '当周', '当月', '至今'],
    activePeriod: '至今'
  },

  onShow() {
    const user = getCurrentUser();
    if (!user) return wx.redirectTo({ url: '/pages/login/login' });
    const space = getActiveSpace();
    this.setData({ user, space, panels: space ? getMemberPanels(space) : [] });
  },

  switchPeriod(e) {
    this.setData({ activePeriod: e.currentTarget.dataset.p });
  },

  handleExitSpace() {
    wx.showModal({
      title: '退出成长空间',
      content: '退出后将返回登录界面；若空间无人绑定，空间数据会被清除。',
      success: (res) => {
        if (!res.confirm) return;
        leaveCurrentSpace(this.data.user.id);
        wx.reLaunch({ url: '/pages/login/login' });
      }
    });
  }
});
