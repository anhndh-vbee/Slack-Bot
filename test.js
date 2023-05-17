// get week of date
function getWeek(date) {
  const weekStart = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - weekStart.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}
