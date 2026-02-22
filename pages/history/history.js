const { getRecords, removeRecord } = require('../../utils/storage');

Page({
  data: {
    records: [],
    filteredRecords: [],
    filterTag: '全部',
    tags: ['全部']
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    const records = getRecords();
    const tags = ['全部', ...new Set(records.map((item) => item.tag))];
    this.setData({ records, tags }, this.applyFilter);
  },

  onFilterTap(e) {
    this.setData({ filterTag: e.currentTarget.dataset.tag }, this.applyFilter);
  },

  applyFilter() {
    const { records, filterTag } = this.data;
    const filteredRecords = filterTag === '全部' ? records : records.filter((item) => item.tag === filterTag);
    this.setData({ filteredRecords });
  },

  handleDelete(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定继续吗？',
      success: (res) => {
        if (res.confirm) {
          removeRecord(id);
          this.loadRecords();
        }
      }
    });
  }
});
