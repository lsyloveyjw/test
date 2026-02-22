const {
  getCurrentUser,
  getActiveSpace,
  addTask,
  updateTask,
  deleteTask,
  checkInTask,
  undoCheckInTask
} = require('../../utils/storage');

Page({
  data: {
    user: null,
    space: null,
    taskTitle: '',
    taskPoints: 1,
    editTaskId: '',
    editTaskTitle: '',
    editTaskPoints: 1
  },

  onShow() {
    const user = getCurrentUser();
    const space = getActiveSpace();
    if (!user) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    if (!space) {
      wx.redirectTo({ url: '/pages/bind/bind' });
      return;
    }
    this.setData({ user, space });
  },

  refreshSpace() {
    this.setData({ space: getActiveSpace() });
  },

  onTaskTitleInput(e) {
    this.setData({ taskTitle: e.detail.value });
  },

  onTaskPointsInput(e) {
    this.setData({ taskPoints: Number(e.detail.value) || 1 });
  },

  addTaskItem() {
    const title = this.data.taskTitle.trim();
    if (!title) return;
    addTask({ title, points: this.data.taskPoints });
    this.setData({ taskTitle: '', taskPoints: 1 });
    this.refreshSpace();
  },

  beginEditTask(e) {
    const { id, title, points } = e.currentTarget.dataset;
    this.setData({ editTaskId: id, editTaskTitle: title, editTaskPoints: Number(points) || 1 });
  },

  onEditTaskTitleInput(e) {
    this.setData({ editTaskTitle: e.detail.value });
  },

  onEditTaskPointsInput(e) {
    this.setData({ editTaskPoints: Number(e.detail.value) || 1 });
  },

  saveEditTask() {
    updateTask(this.data.editTaskId, {
      title: this.data.editTaskTitle.trim(),
      points: this.data.editTaskPoints
    });
    this.setData({ editTaskId: '' });
    this.refreshSpace();
  },

  removeTask(e) {
    deleteTask(e.currentTarget.dataset.id);
    this.refreshSpace();
  },

  doCheckIn(e) {
    checkInTask(e.currentTarget.dataset.id, this.data.user.id);
    this.refreshSpace();
  },

  undoCheckIn(e) {
    undoCheckInTask(e.currentTarget.dataset.id, this.data.user.id);
    this.refreshSpace();
  }
});
