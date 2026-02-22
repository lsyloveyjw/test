const { getCurrentUser, getActiveSpace, getMemberPanels } = require('../../utils/storage');

Page({
  data: {
    space: null,
    panels: []
  },

  onShow() {
    const user = getCurrentUser();
    if (!user) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    const space = getActiveSpace();
    this.setData({
      space,
      panels: space ? getMemberPanels(space) : []
    });
  }
});
