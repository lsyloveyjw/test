const RECORD_KEY = 'clockin_records_v2';

function getRecords() {
  return wx.getStorageSync(RECORD_KEY) || [];
}

function saveRecords(records) {
  wx.setStorageSync(RECORD_KEY, records);
}

function addRecord(record) {
  const records = getRecords();
  records.unshift(record);
  saveRecords(records);
  return records;
}

function removeRecord(id) {
  const records = getRecords().filter((item) => item.id !== id);
  saveRecords(records);
  return records;
}

function summaryByDate(records) {
  return records.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});
}

function summaryByTag(records) {
  return records.reduce((acc, item) => {
    acc[item.tag] = (acc[item.tag] || 0) + 1;
    return acc;
  }, {});
}

module.exports = {
  getRecords,
  addRecord,
  removeRecord,
  summaryByDate,
  summaryByTag
};
