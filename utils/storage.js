const USER_KEY = 'growth_user_v1';
const SPACES_KEY = 'growth_spaces_v1';
const ACTIVE_SPACE_KEY = 'growth_active_space_v1';

function getCurrentUser() {
  return wx.getStorageSync(USER_KEY) || null;
}

function registerUser({ nickname, avatarUrl }) {
  const user = {
    id: `u_${Date.now()}`,
    nickname,
    avatarUrl: avatarUrl || '',
    createdAt: Date.now()
  };
  wx.setStorageSync(USER_KEY, user);
  return user;
}

function updateCurrentUser(patch) {
  const user = getCurrentUser();
  if (!user) return null;
  const next = { ...user, ...patch };
  wx.setStorageSync(USER_KEY, next);

  const code = wx.getStorageSync(ACTIVE_SPACE_KEY);
  if (code) {
    const spaces = getSpaces();
    const idx = spaces.findIndex((item) => item.code === code);
    if (idx >= 0 && spaces[idx].members[user.id]) {
      spaces[idx].members[user.id] = {
        ...spaces[idx].members[user.id],
        nickname: next.nickname,
        avatarUrl: next.avatarUrl
      };
      saveSpaces(spaces);
    }
  }
  return next;
}

function getSpaces() {
  return wx.getStorageSync(SPACES_KEY) || [];
}

function saveSpaces(spaces) {
  wx.setStorageSync(SPACES_KEY, spaces);
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
    tasks: [],
    rewards: [],
    deletedCheckins: 0,
    createdAt: Date.now()
  };
  spaces.unshift(space);
  saveSpaces(spaces);
  wx.setStorageSync(ACTIVE_SPACE_KEY, code);
  return space;
}

function joinSpace(code, user) {
  const spaces = getSpaces();
  const idx = spaces.findIndex((item) => item.code === code.trim().toUpperCase());
  if (idx < 0) return null;
  spaces[idx].members[user.id] = {
    nickname: user.nickname,
    avatarUrl: user.avatarUrl
  };
  saveSpaces(spaces);
  wx.setStorageSync(ACTIVE_SPACE_KEY, spaces[idx].code);
  return spaces[idx];
}

function getActiveSpace() {
  const code = wx.getStorageSync(ACTIVE_SPACE_KEY);
  if (!code) return null;
  return getSpaces().find((item) => item.code === code) || null;
}

function updateActiveSpace(updater) {
  const code = wx.getStorageSync(ACTIVE_SPACE_KEY);
  if (!code) return null;
  const spaces = getSpaces();
  const idx = spaces.findIndex((item) => item.code === code);
  if (idx < 0) return null;
  const next = updater({ ...spaces[idx] });
  spaces[idx] = next;
  saveSpaces(spaces);
  return next;
}

function addTask(task) {
  return updateActiveSpace((space) => {
    space.tasks.unshift({
      id: `t_${Date.now()}`,
      title: task.title,
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
      return {
        ...item,
        doneCount: item.doneCount + 1,
        checkinsByUser: { ...item.checkinsByUser, [userId]: userDone }
      };
    });
    return space;
  });
}

function undoCheckInTask(taskId, userId) {
  return updateActiveSpace((space) => {
    space.tasks = space.tasks.map((item) => {
      if (item.id !== taskId) return item;
      const current = item.checkinsByUser[userId] || 0;
      if (current <= 0) return item;
      return {
        ...item,
        doneCount: Math.max(0, item.doneCount - 1),
        checkinsByUser: { ...item.checkinsByUser, [userId]: current - 1 }
      };
    });
    space.deletedCheckins += 1;
    return space;
  });
}

function addReward(reward) {
  return updateActiveSpace((space) => {
    space.rewards.unshift({
      id: `r_${Date.now()}`,
      title: reward.title,
      points: Number(reward.points) || 10,
      createdAt: Date.now()
    });
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
  const members = Object.keys(space.members).map((id) => ({ id, ...space.members[id] }));
  return members.map((member) => {
    let points = 0;
    let checkins = 0;
    space.tasks.forEach((task) => {
      const c = task.checkinsByUser[member.id] || 0;
      checkins += c;
      points += c * task.points;
    });
    return { ...member, points, checkins };
  });
}

module.exports = {
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
  undoCheckInTask,
  addReward,
  updateReward,
  deleteReward,
  getMemberPanels
};
