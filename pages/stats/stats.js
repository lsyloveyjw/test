const { getActiveSpace, getMemberPanels } = require('../../utils/storage');

Page({
  data: {
    space: null,
    panels: []
  },

  onShow() {
    const space = getActiveSpace();
    this.setData({
      space,
      panels: space ? getMemberPanels(space) : []
    });
  }
});
