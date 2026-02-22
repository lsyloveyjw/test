const { getRecords, getRepairRecords } = require('../../utils/storage');

Page({
  data: {
    tab: 'growth',
    growthRecords: [],
    repairRecords: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    this.setData({
      growthRecords: getRecords(),
      repairRecords: getRepairRecords()
    });
  },

  onTabTap(e) {
    this.setData({ tab: e.currentTarget.dataset.tab });
  }
});
