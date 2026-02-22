const { formatDate, formatTime, daysSince, daysUntil } = require('../../utils/date');
const {
  addRecord,
  addRepairRecord,
  getProfile,
  saveProfile,
  getRecords,
  getRepairRecords
} = require('../../utils/storage');

Page({
  data: {
    users: [
      { key: 'me', label: '我' },
      { key: 'partner', label: 'TA' }
    ],
    selectedUser: 'me',
    tags: ['沟通', '运动', '学习', '约会', '复盘'],
    selectedTag: '沟通',
    note: '',
    repairNote: '',
    profile: {
      anniversaryDate: '2024-01-01',
      nextMilestone: '02-14'
    },
    loveDays: 0,
    countdownDays: 0,
    todayGrowthCount: 0,
    todayRepairCount: 0
  },

  onShow() {
    this.refreshDashboard();
  },

  refreshDashboard() {
    const profile = getProfile();
    const today = formatDate();
    const growth = getRecords().filter((r) => r.date === today).length;
    const repair = getRepairRecords().filter((r) => r.date === today).length;
    this.setData({
      profile,
      loveDays: Math.max(0, daysSince(profile.anniversaryDate)) + 1,
      countdownDays: daysUntil(profile.nextMilestone),
      todayGrowthCount: growth,
      todayRepairCount: repair
    });
  },

  onUserTap(e) {
    this.setData({ selectedUser: e.currentTarget.dataset.user });
  },

  onTagTap(e) {
    this.setData({ selectedTag: e.currentTarget.dataset.tag });
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  onRepairInput(e) {
    this.setData({ repairNote: e.detail.value });
  },

  onAnniversaryInput(e) {
    this.setData({ 'profile.anniversaryDate': e.detail.value });
  },

  onMilestoneInput(e) {
    this.setData({ 'profile.nextMilestone': e.detail.value });
  },

  saveProfileConfig() {
    saveProfile(this.data.profile);
    this.refreshDashboard();
    wx.showToast({ title: '纪念日已更新', icon: 'success' });
  },

  submitGrowth() {
    addRecord({
      id: `${Date.now()}`,
      type: 'growth',
      user: this.data.selectedUser,
      tag: this.data.selectedTag,
      note: this.data.note.trim(),
      date: formatDate(),
      time: formatTime(),
      createdAt: Date.now()
    });
    this.setData({ note: '' });
    this.refreshDashboard();
    wx.showToast({ title: '成长记录成功', icon: 'success' });
  },

  submitRepair() {
    const note = this.data.repairNote.trim();
    if (!note) {
      wx.showToast({ title: '请填写修复内容', icon: 'none' });
      return;
    }
    addRepairRecord({
      id: `${Date.now()}`,
      type: 'repair',
      user: this.data.selectedUser,
      note,
      date: formatDate(),
      time: formatTime(),
      createdAt: Date.now()
    });
    this.setData({ repairNote: '' });
    this.refreshDashboard();
    wx.showToast({ title: '修复记录成功', icon: 'success' });
  }
});
