const RECORD_KEY = 'couple_growth_records_v3';
const REPAIR_KEY = 'couple_repair_records_v2';
const PROFILE_KEY = 'couple_profile_v1';
const TASK_KEY = 'couple_tasks_v1';

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
  return wx.getStorageSync(PROFILE_KEY) || {
    anniversaryDate: '2024-01-01',
    nextMilestone: '02-14'
  };
}

function saveProfile(profile) {
  wx.setStorageSync(PROFILE_KEY, profile);
}

function getTasks() {
  return wx.getStorageSync(TASK_KEY) || [];
}

function initTasks() {
  const tasks = getTasks();
  if (tasks.length) return tasks;
  const seed = [
    { id: 'd1', tree: '科技树', title: 'D1 Concept Block Study', desc: '学习一个概念模块并做要点记录。', points: 1, done: 0, target: 1 },
    { id: 'd2', tree: '科技树', title: 'D2 Retrieval Mix Drill', desc: '完成一次多源检索混合训练。', points: 1, done: 0, target: 1 },
    { id: 'e1', tree: '情感树', title: '记录一件快乐的小事', desc: '写下今天最开心的一件事，培养积极感受。', points: 1, done: 0, target: 3 },
    { id: 'e2', tree: '情感树', title: '度过充实满意的一天', desc: '完成关键任务并在晚上复盘。', points: 1, done: 0, target: 1 }
  ];
  wx.setStorageSync(TASK_KEY, seed);
  return seed;
}

function updateTaskProgress(id) {
  const tasks = getTasks().map((item) => {
    if (item.id !== id) return item;
    const done = Math.min(item.target, item.done + 1);
    return { ...item, done };
  });
  wx.setStorageSync(TASK_KEY, tasks);
  return tasks;
}

function summaryByDate(records) {
  return records.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});
}

function sumPointsByTree(tasks) {
  return tasks.reduce(
    (acc, item) => {
      const total = item.done * item.points;
      if (item.tree === '科技树') acc.tech += total;
      if (item.tree === '情感树') acc.emotion += total;
      return acc;
    },
    { tech: 0, emotion: 0 }
  );
}

module.exports = {
  getRecords,
  addRecord,
  getRepairRecords,
  addRepairRecord,
  getProfile,
  saveProfile,
  getTasks,
  initTasks,
  updateTaskProgress,
  summaryByDate,
  sumPointsByTree
};
