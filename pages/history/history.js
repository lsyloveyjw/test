const { getActiveSpace, addReward, updateReward, deleteReward } = require('../../utils/storage');

Page({
  data: {
    space: null,
    rewardTitle: '',
    rewardPoints: 10,
    editRewardId: '',
    editRewardTitle: '',
    editRewardPoints: 10
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    this.setData({ space: getActiveSpace() });
  },

  onRewardTitleInput(e) {
    this.setData({ rewardTitle: e.detail.value });
  },

  onRewardPointsInput(e) {
    this.setData({ rewardPoints: Number(e.detail.value) || 10 });
  },

  addRewardItem() {
    if (!this.data.rewardTitle.trim()) return;
    addReward({ title: this.data.rewardTitle.trim(), points: this.data.rewardPoints });
    this.setData({ rewardTitle: '', rewardPoints: 10 });
    this.refresh();
  },

  beginEdit(e) {
    const { id, title, points } = e.currentTarget.dataset;
    this.setData({ editRewardId: id, editRewardTitle: title, editRewardPoints: Number(points) || 10 });
  },

  onEditRewardTitleInput(e) {
    this.setData({ editRewardTitle: e.detail.value });
  },

  onEditRewardPointsInput(e) {
    this.setData({ editRewardPoints: Number(e.detail.value) || 10 });
  },

  saveEdit() {
    updateReward(this.data.editRewardId, {
      title: this.data.editRewardTitle.trim(),
      points: this.data.editRewardPoints
    });
    this.setData({ editRewardId: '' });
    this.refresh();
  },

  removeReward(e) {
    deleteReward(e.currentTarget.dataset.id);
    this.refresh();
  }
});
