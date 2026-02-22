function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatDate(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatTime(date = new Date()) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function todayLocalDate() {
  return formatDate(new Date());
}

function dateFromYMD(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function previousDate(ymd) {
  const dt = dateFromYMD(ymd);
  dt.setDate(dt.getDate() - 1);
  return formatDate(dt);
}

module.exports = {
  formatDate,
  formatTime,
  todayLocalDate,
  previousDate
};
