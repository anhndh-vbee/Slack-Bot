const dayOfWeekNames = require('../config/dayOfWeek');

const getDayOfWeekName = (date) => {
  if (typeof date === 'object' && date instanceof Date) {
    // if is date object
    return dayOfWeekNames[date.getDay()];
  }
  // if is index
  return dayOfWeekNames[date % 7];
};

module.exports = { getDayOfWeekName };
