const RECORD_KEY = 'couple_growth_records_v2';
const REPAIR_KEY = 'couple_repair_records_v1';
const PROFILE_KEY = 'couple_profile_v1';

function getRecords() {
  return wx.getStorageSync(RECORD_KEY) || [];
}

function saveRecords(records) {
  wx.setStorageSync(RECORD_KEY, records);
}

function addRecord(record) {
  const list = getRecords();
  list.unshift(record);
  saveRecords(list);
  return list;
}

function getRepairRecords() {
  return wx.getStorageSync(REPAIR_KEY) || [];
}

function addRepairRecord(record) {
  const list = getRepairRecords();
  list.unshift(record);
  wx.setStorageSync(REPAIR_KEY, list);
  return list;
}

function getProfile() {
  return (
    wx.getStorageSync(PROFILE_KEY) || {
      anniversaryDate: '2024-01-01',
      nextMilestone: '02-14'
    }
  );
}

function saveProfile(profile) {
  wx.setStorageSync(PROFILE_KEY, profile);
}

function summaryByDate(records) {
  return records.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});
}

function summaryByType(records) {
  return records.reduce((acc, item) => {
    const key = item.type || 'growth';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

module.exports = {
  getRecords,
  addRecord,
  getRepairRecords,
  addRepairRecord,
  getProfile,
  saveProfile,
  summaryByDate,
  summaryByType
};
