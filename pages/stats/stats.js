const { getRecords, getRepairRecords, getProfile, summaryByDate, summaryByType } = require('../../utils/storage');
const { formatDate, previousDate, daysSince, daysUntil } = require('../../utils/date');

function calcStreak(dateMap) {
  let streak = 0;
  let cursor = formatDate();
  while (dateMap[cursor]) {
    streak += 1;
    cursor = previousDate(cursor);
  }
  return streak;
}

function calcRelationshipScore(growthRecords, repairRecords) {
  const recentDays = new Set();
  let cursor = formatDate();
  for (let i = 0; i < 7; i += 1) {
    recentDays.add(cursor);
    cursor = previousDate(cursor);
  }
  const recentGrowth = growthRecords.filter((r) => recentDays.has(r.date)).length;
  const recentRepair = repairRecords.filter((r) => recentDays.has(r.date)).length;
  const interactionScore = Math.min(60, recentGrowth * 8 + recentRepair * 6);
  const repairBonus = Math.min(40, repairRecords.length * 4);
  return Math.min(100, interactionScore + repairBonus);
}

Page({
  data: {
    loveDays: 0,
    countdownDays: 0,
    growthTotal: 0,
    repairTotal: 0,
    streak: 0,
    relationScore: 0,
    recentTrend: [],
    typeSummary: []
  },

  onShow() {
    const growth = getRecords();
    const repair = getRepairRecords();
    const profile = getProfile();
    const merged = [...growth, ...repair];
    const dateMap = summaryByDate(merged);
    const typeMap = summaryByType(merged);
    const dates = Object.keys(dateMap).sort().reverse();

    this.setData({
      loveDays: Math.max(0, daysSince(profile.anniversaryDate)) + 1,
      countdownDays: daysUntil(profile.nextMilestone),
      growthTotal: growth.length,
      repairTotal: repair.length,
      streak: calcStreak(dateMap),
      relationScore: calcRelationshipScore(growth, repair),
      recentTrend: dates.slice(0, 14).map((date) => ({ date, count: dateMap[date] })),
      typeSummary: Object.keys(typeMap).map((k) => ({ type: k, count: typeMap[k] }))
    });
  }
});
