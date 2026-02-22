function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDate(d = new Date()) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatTime(d = new Date()) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function parseYMD(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function previousDate(ymd) {
  const t = parseYMD(ymd);
  t.setDate(t.getDate() - 1);
  return formatDate(t);
}

function diffDays(fromYmd, toYmd) {
  const from = parseYMD(fromYmd);
  const to = parseYMD(toYmd);
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / dayMs);
}

function daysSince(startYmd) {
  return diffDays(startYmd, formatDate());
}

function daysUntil(monthDay) {
  const today = new Date();
  const [m, d] = monthDay.split('-').map(Number);
  let next = new Date(today.getFullYear(), m - 1, d);
  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next = new Date(today.getFullYear() + 1, m - 1, d);
  }
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.ceil((next.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / dayMs);
}

module.exports = {
  formatDate,
  formatTime,
  previousDate,
  daysSince,
  daysUntil
};
