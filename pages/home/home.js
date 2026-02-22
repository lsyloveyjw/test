const { addRecord, getRecords } = require('../../utils/storage');
const { formatDate, formatTime, todayLocalDate } = require('../../utils/date');

Page({
  data: {
    tags: ['学习', '运动', '阅读', '工作', '早睡', '喝水'],
    selectedTag: '学习',
    note: '',
    mood: '😀',
    moods: ['😀', '😌', '🔥', '💪', '🌈'],
    todayCount: 0,
    latestRecord: null
  },

  onShow() {
    this.refreshHome();
  },

  refreshHome() {
    const records = getRecords();
    const today = todayLocalDate();
    const todayCount = records.filter((item) => item.date === today).length;

    this.setData({
      todayCount,
      latestRecord: records[0] || null
    });
  },

  onTagTap(e) {
    this.setData({ selectedTag: e.currentTarget.dataset.tag });
  },

  onMoodTap(e) {
    this.setData({ mood: e.currentTarget.dataset.mood });
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  handleClockIn() {
    const note = this.data.note.trim();
    const record = {
      id: `${Date.now()}`,
      tag: this.data.selectedTag,
      mood: this.data.mood,
      note,
      date: formatDate(),
      time: formatTime(),
      createdAt: Date.now()
    };

    addRecord(record);
    this.setData({ note: '' });
    this.refreshHome();

    wx.showToast({
      title: '打卡成功',
      icon: 'success'
    });
  }
});
