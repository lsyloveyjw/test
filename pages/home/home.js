const {
  getCurrentUser,
  registerUser,
  updateCurrentUser,
  createSpace,
  joinSpace,
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
    nicknameInput: '',
    joinCode: '',
    space: null,
    taskTitle: '',
    taskPoints: 1,
    editTaskId: '',
    editTaskTitle: '',
    editTaskPoints: 1
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    this.setData({
      user: getCurrentUser(),
      space: getActiveSpace(),
      memberCount: getActiveSpace() ? Object.keys(getActiveSpace().members).length : 0
    });
  },

  onNicknameInput(e) {
    this.setData({ nicknameInput: e.detail.value });
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const avatarUrl = res.tempFilePaths[0];
        if (this.data.user) {
          updateCurrentUser({ avatarUrl });
        }
        this.setData({ user: { ...(this.data.user || {}), avatarUrl } });
      }
    });
  },

  register() {
    if (!this.data.nicknameInput.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    const avatarUrl = (this.data.user && this.data.user.avatarUrl) || '';
    registerUser({ nickname: this.data.nicknameInput.trim(), avatarUrl });
    this.refresh();
  },

  createGrowthSpace() {
    const user = getCurrentUser();
    if (!user) return;
    createSpace(user);
    this.refresh();
  },

  onCodeInput(e) {
    this.setData({ joinCode: e.detail.value });
  },

  joinGrowthSpace() {
    const user = getCurrentUser();
    if (!user || !this.data.joinCode.trim()) return;
    const joined = joinSpace(this.data.joinCode.trim(), user);
    if (!joined) {
      wx.showToast({ title: '绑定码无效', icon: 'none' });
      return;
    }
    this.setData({ joinCode: '' });
    this.refresh();
  },

  onTaskTitleInput(e) {
    this.setData({ taskTitle: e.detail.value });
  },

  onTaskPointsInput(e) {
    this.setData({ taskPoints: Number(e.detail.value) || 1 });
  },

  addTaskItem() {
    if (!this.data.taskTitle.trim()) return;
    addTask({ title: this.data.taskTitle.trim(), points: this.data.taskPoints });
    this.setData({ taskTitle: '', taskPoints: 1 });
    this.refresh();
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
    this.refresh();
  },

  removeTask(e) {
    deleteTask(e.currentTarget.dataset.id);
    this.refresh();
  },

  doCheckIn(e) {
    const user = this.data.user;
    if (!user) return;
    checkInTask(e.currentTarget.dataset.id, user.id);
    this.refresh();
  },

  undoCheckIn(e) {
    const user = this.data.user;
    if (!user) return;
    undoCheckInTask(e.currentTarget.dataset.id, user.id);
    this.refresh();
  }
});
