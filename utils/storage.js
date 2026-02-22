const USER_KEY = 'growth_user_v3';
const SPACES_KEY = 'growth_spaces_v3';
const ACTIVE_SPACE_KEY = 'growth_active_space_v3';

function getCurrentUser() {
  return wx.getStorageSync(USER_KEY) || null;
}

function saveCurrentUser(profile) {
  const old = getCurrentUser();
  const user = {
    id: (old && old.id) || `u_${Date.now()}`,
    nickname: profile.nickName || profile.nickname || '微信用户',
    avatarUrl: profile.avatarUrl || '',
    updatedAt: Date.now()
  };
  wx.setStorageSync(USER_KEY, user);
  return user;
}

function clearCurrentUser() {
  wx.removeStorageSync(USER_KEY);
}

function getSpaces() {
  return wx.getStorageSync(SPACES_KEY) || [];
}

function saveSpaces(spaces) {
  wx.setStorageSync(SPACES_KEY, spaces);
}

function getActiveSpaceCode() {
  return wx.getStorageSync(ACTIVE_SPACE_KEY) || '';
}

function setActiveSpaceCode(code) {
  wx.setStorageSync(ACTIVE_SPACE_KEY, code || '');
}

function getActiveSpace() {
  const code = getActiveSpaceCode();
  if (!code) return null;
  return getSpaces().find((item) => item.code === code) || null;
}

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function createSpace(owner) {
  const spaces = getSpaces();
  let code = randomCode();
  while (spaces.some((item) => item.code === code)) code = randomCode();

  const space = {
    id: `s_${Date.now()}`,
    code,
    members: {
      [owner.id]: { nickname: owner.nickname, avatarUrl: owner.avatarUrl }
    },
    tasks: [
      { id: 'd1', group: 'Discovery', title: 'D1 Concept Block Study', desc: '学习一个概念模块并做要点记录。', points: 1, doneCount: 0, checkinsByUser: {} },
      { id: 'd2', group: 'Discovery', title: 'D2 Retrieval Mix Drill', desc: '完成一次多源检索混合训练。', points: 1, doneCount: 0, checkinsByUser: {} },
      { id: 'c1', group: 'Creation', title: 'C1 Micro Output', desc: '产出一个小而完整的成果。', points: 2, doneCount: 0, checkinsByUser: {} }
    ],
    rewards: [],
    deletedCheckins: 0,
    createdAt: Date.now()
  };

  spaces.unshift(space);
  saveSpaces(spaces);
  setActiveSpaceCode(code);
  return space;
}

function joinSpace(code, user) {
  const targetCode = (code || '').trim().toUpperCase();
  const spaces = getSpaces();
  const idx = spaces.findIndex((item) => item.code === targetCode);
  if (idx < 0) return null;
  spaces[idx].members[user.id] = {
    nickname: user.nickname,
    avatarUrl: user.avatarUrl
  };
  saveSpaces(spaces);
  setActiveSpaceCode(targetCode);
  return spaces[idx];
}

function leaveCurrentSpace(userId) {
  const code = getActiveSpaceCode();
  if (!code) {
    clearCurrentUser();
    return;
  }
  const spaces = getSpaces();
  const idx = spaces.findIndex((item) => item.code === code);
  if (idx >= 0) {
    delete spaces[idx].members[userId];
    if (Object.keys(spaces[idx].members).length === 0) {
      spaces.splice(idx, 1);
    }
    saveSpaces(spaces);
  }
  setActiveSpaceCode('');
  clearCurrentUser();
}

function updateActiveSpace(updater) {
  const code = getActiveSpaceCode();
  if (!code) return null;
  const spaces = getSpaces();
  const idx = spaces.findIndex((item) => item.code === code);
  if (idx < 0) return null;
  spaces[idx] = updater({ ...spaces[idx] });
  saveSpaces(spaces);
  return spaces[idx];
}

function addTask(task) {
  return updateActiveSpace((space) => {
    space.tasks.unshift({
      id: `t_${Date.now()}`,
      group: task.group || 'Custom',
      title: task.title,
      desc: task.desc || '自定义成长事件',
      points: Number(task.points) || 1,
      doneCount: 0,
      checkinsByUser: {},
      createdAt: Date.now()
    });
    return space;
  });
}

function updateTask(taskId, patch) {
  return updateActiveSpace((space) => {
    space.tasks = space.tasks.map((item) => (item.id === taskId ? { ...item, ...patch } : item));
    return space;
  });
}

function deleteTask(taskId) {
  return updateActiveSpace((space) => {
    space.tasks = space.tasks.filter((item) => item.id !== taskId);
    return space;
  });
}

function checkInTask(taskId, userId) {
  return updateActiveSpace((space) => {
    space.tasks = space.tasks.map((item) => {
      if (item.id !== taskId) return item;
      const userDone = (item.checkinsByUser[userId] || 0) + 1;
      return { ...item, doneCount: item.doneCount + 1, checkinsByUser: { ...item.checkinsByUser, [userId]: userDone } };
    });
    return space;
  });
}

function undoCheckInTask(taskId, userId) {
  return updateActiveSpace((space) => {
    let removed = false;
    space.tasks = space.tasks.map((item) => {
      if (item.id !== taskId) return item;
      const current = item.checkinsByUser[userId] || 0;
      if (current <= 0) return item;
      removed = true;
      return { ...item, doneCount: Math.max(0, item.doneCount - 1), checkinsByUser: { ...item.checkinsByUser, [userId]: current - 1 } };
    });
    if (removed) space.deletedCheckins += 1;
    return space;
  });
}

function addReward(reward) {
  return updateActiveSpace((space) => {
    space.rewards.unshift({ id: `r_${Date.now()}`, title: reward.title, points: Number(reward.points) || 10, createdAt: Date.now() });
    return space;
  });
}

function updateReward(rewardId, patch) {
  return updateActiveSpace((space) => {
    space.rewards = space.rewards.map((item) => (item.id === rewardId ? { ...item, ...patch } : item));
    return space;
  });
}

function deleteReward(rewardId) {
  return updateActiveSpace((space) => {
    space.rewards = space.rewards.filter((item) => item.id !== rewardId);
    return space;
  });
}

function getMemberPanels(space) {
  return Object.keys(space.members).map((id) => {
    const member = space.members[id];
    let checkins = 0;
    let points = 0;
    let discovery = 0;
    let creation = 0;
    space.tasks.forEach((task) => {
      const count = task.checkinsByUser[id] || 0;
      checkins += count;
      points += count * task.points;
      if (task.group === 'Discovery') discovery += count * task.points;
      if (task.group === 'Creation') creation += count * task.points;
    });
    return { id, nickname: member.nickname, avatarUrl: member.avatarUrl, checkins, points, discovery, creation };
  });
}

module.exports = {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  getActiveSpace,
  createSpace,
  joinSpace,
  leaveCurrentSpace,
  addTask,
  updateTask,
  deleteTask,
  checkInTask,
  undoCheckInTask,
  addReward,
  updateReward,
  deleteReward,
  getMemberPanels
};
