// dateString: d-m-y
const getDetailDay = (dateString) => {
  const dateParts = dateString.split('-');
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1; // Months are zero-indexed, so subtract 1
  const day = parseInt(dateParts[0]);
  const date = new Date(year, month, day);
  const options = { weekday: 'long' };
  const dayOfWeek = date.toLocaleDateString('en-US', options);
  return dayOfWeek;
};

const getDayOfWeek = (number) => {
  const daysOfWeek = [
    'saturday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];
  const dayIndex = (number % 6) - 1;
  return daysOfWeek[dayIndex];
};

// get week of date
function getWeek(date) {
  const weekStart = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - weekStart.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

module.exports = { getDetailDay, getDayOfWeek, getWeek };
