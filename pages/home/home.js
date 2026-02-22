const { formatDate, formatTime, daysSince, daysUntil } = require('../../utils/date');
const { getProfile, saveProfile, getTasks, initTasks, updateTaskProgress, addRecord } = require('../../utils/storage');

Page({
  data: {
    ownerList: ['呱呱', '咩'],
    owner: '呱呱',
    profile: { anniversaryDate: '2024-01-01', nextMilestone: '02-14' },
    loveDays: 0,
    countdownDays: 0,
    tasks: [],
    customTaskTitle: '',
    customTaskDesc: ''
  },

  onShow() {
    initTasks();
    this.refreshPage();
  },

  refreshPage() {
    const profile = getProfile();
    this.setData({
      profile,
      loveDays: Math.max(0, daysSince(profile.anniversaryDate)) + 1,
      countdownDays: daysUntil(profile.nextMilestone),
      tasks: getTasks()
    });
  },

  switchOwner(e) {
    this.setData({ owner: e.currentTarget.dataset.owner });
  },

  onAnniversaryInput(e) {
    this.setData({ 'profile.anniversaryDate': e.detail.value });
  },

  onMilestoneInput(e) {
    this.setData({ 'profile.nextMilestone': e.detail.value });
  },

  saveDates() {
    saveProfile(this.data.profile);
    this.refreshPage();
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  finishTask(e) {
    const id = e.currentTarget.dataset.id;
    const tasks = updateTaskProgress(id);
    const task = tasks.find((t) => t.id === id);

    addRecord({
      id: `${Date.now()}`,
      type: 'growth',
      owner: this.data.owner,
      note: `${task.title} +${task.points}分`,
      tree: task.tree,
      date: formatDate(),
      time: formatTime(),
      createdAt: Date.now()
    });

    this.setData({ tasks });
    wx.showToast({ title: '+1 成长值', icon: 'success' });
  }
});
