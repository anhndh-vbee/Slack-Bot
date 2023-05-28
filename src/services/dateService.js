// get date in UTC+7
const getDateUTC = () => {
  const now = new Date();
  const gmtOffset = 7 * 60 * 60 * 1000; // Offset in milliseconds
  const targetTime = now.getTime() + gmtOffset;
  const targetDate = new Date(targetTime);
  return targetDate;
};

const getDayOfWeek = (number) => {
  const daysOfWeek = [
    'saturday',
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];
  const dayIndex = number % 7;
  return daysOfWeek[dayIndex];
};

// get week of date
function getWeek(date) {
  const weekStart = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - weekStart.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

module.exports = { getDateUTC, getDayOfWeek, getWeek };
