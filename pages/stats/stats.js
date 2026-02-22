const { getTasks, sumPointsByTree } = require('../../utils/storage');

Page({
  data: {
    periods: ['当天', '当周', '当月', '至今'],
    activePeriod: '至今',
    aName: '呱呱',
    bName: '咩',
    aTech: 0,
    aEmotion: 0,
    bTech: 0,
    bEmotion: 0
  },

  onShow() {
    this.compute();
  },

  switchPeriod(e) {
    this.setData({ activePeriod: e.currentTarget.dataset.p }, this.compute);
  },

  compute() {
    const total = sumPointsByTree(getTasks());
    const aTech = total.tech;
    const aEmotion = total.emotion;
    const bTech = Math.max(0, Math.floor(total.tech * 0.4));
    const bEmotion = Math.max(0, Math.floor(total.emotion * 0.75));
    this.setData({ aTech, aEmotion, bTech, bEmotion });
  }
});
