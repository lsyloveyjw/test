const { getRecords, summaryByDate, summaryByTag } = require('../../utils/storage');
const { todayLocalDate, previousDate } = require('../../utils/date');

Page({
  data: {
    total: 0,
    activeDays: 0,
    currentStreak: 0,
    dateSummary: [],
    tagSummary: []
  },

  onShow() {
    this.computeStats();
  },

  computeStats() {
    const records = getRecords();
    const dateMap = summaryByDate(records);
    const tagMap = summaryByTag(records);
    const dates = Object.keys(dateMap).sort().reverse();

    this.setData({
      total: records.length,
      activeDays: dates.length,
      currentStreak: this.calcStreak(dateMap),
      dateSummary: dates.slice(0, 14).map((date) => ({ date, count: dateMap[date] })),
      tagSummary: Object.keys(tagMap)
        .map((tag) => ({ tag, count: tagMap[tag] }))
        .sort((a, b) => b.count - a.count)
    });
  },

  calcStreak(dateMap) {
    const dateSet = new Set(Object.keys(dateMap));
    let streak = 0;
    let cursor = todayLocalDate();

    while (dateSet.has(cursor)) {
      streak += 1;
      cursor = previousDate(cursor);
    }
    return streak;
  }
});
