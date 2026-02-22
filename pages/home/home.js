const {
  getCurrentUser,
  getActiveSpace,
  addTask,
  updateTask,
  deleteTask,
  checkInTask,
  undoCheckInTask
} = require('../../utils/storage');

function groupTasks(tasks = []) {
  return {
    discovery: tasks.filter((t) => t.group === 'Discovery'),
    creation: tasks.filter((t) => t.group === 'Creation'),
    custom: tasks.filter((t) => !['Discovery', 'Creation'].includes(t.group))
  };
}

Page({
  data: {
    user: null,
    space: null,
    groups: { discovery: [], creation: [], custom: [] },
    taskTitle: '',
    taskDesc: '',
    taskPoints: 1,
    taskGroup: 'Custom',
    editTaskId: '',
    editTaskTitle: '',
    editTaskDesc: '',
    editTaskPoints: 1,
    editTaskGroup: 'Custom'
  },

  onShow() {
    const user = getCurrentUser();
    const space = getActiveSpace();
    if (!user) return wx.redirectTo({ url: '/pages/login/login' });
    if (!space) return wx.redirectTo({ url: '/pages/bind/bind' });
    this.setData({ user });
    this.refreshSpace();
  },

  refreshSpace() {
    const space = getActiveSpace();
    this.setData({ space, groups: groupTasks(space ? space.tasks : []) });
  },

  onTaskTitleInput(e) { this.setData({ taskTitle: e.detail.value }); },
  onTaskDescInput(e) { this.setData({ taskDesc: e.detail.value }); },
  onTaskPointsInput(e) { this.setData({ taskPoints: Number(e.detail.value) || 1 }); },
  onGroupChange(e) { this.setData({ taskGroup: e.currentTarget.dataset.g }); },

  addTaskItem() {
    const title = this.data.taskTitle.trim();
    if (!title) return;
    addTask({
      title,
      desc: this.data.taskDesc.trim(),
      points: this.data.taskPoints,
      group: this.data.taskGroup
    });
    this.setData({ taskTitle: '', taskDesc: '', taskPoints: 1, taskGroup: 'Custom' });
    this.refreshSpace();
  },

  beginEditTask(e) {
    const { id, title, desc, points, group } = e.currentTarget.dataset;
    this.setData({
      editTaskId: id,
      editTaskTitle: title,
      editTaskDesc: desc || '',
      editTaskPoints: Number(points) || 1,
      editTaskGroup: group || 'Custom'
    });
  },

  onEditTaskTitleInput(e) { this.setData({ editTaskTitle: e.detail.value }); },
  onEditTaskDescInput(e) { this.setData({ editTaskDesc: e.detail.value }); },
  onEditTaskPointsInput(e) { this.setData({ editTaskPoints: Number(e.detail.value) || 1 }); },
  onEditGroupChange(e) { this.setData({ editTaskGroup: e.currentTarget.dataset.g }); },

  saveEditTask() {
    updateTask(this.data.editTaskId, {
      title: this.data.editTaskTitle.trim(),
      desc: this.data.editTaskDesc.trim(),
      points: this.data.editTaskPoints,
      group: this.data.editTaskGroup
    });
    this.setData({ editTaskId: '' });
    this.refreshSpace();
  },

  removeTask(e) { deleteTask(e.currentTarget.dataset.id); this.refreshSpace(); },
  doCheckIn(e) { checkInTask(e.currentTarget.dataset.id, this.data.user.id); this.refreshSpace(); },
  undoCheckIn(e) { undoCheckInTask(e.currentTarget.dataset.id, this.data.user.id); this.refreshSpace(); }
});
