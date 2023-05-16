const { isValidCheckIn } = require('./isValidCheckIn');

const inValidChechInDashboard = (detail, days) => {
  // days = [[time, time], [time, time], ]
  let result = [];
  days.forEach((element) => {
    const checkInTime = element[0];
    const checkOutTime = element[element.length - 1];
    const { isValid } = isValidCheckIn(checkInTime, checkOutTime);
    const day = checkInTime.getDate();
    const month = checkInTime.getMonth() + 1;
    const year = checkInTime.getFullYear();
    if (!isValid) {
      let time;
      switch (detail) {
        case 'day':
          time = `${day}/${month}/${year}`;
          break;
        case 'month':
          time = `${month}/${year}`;
          break;
        default:
          throw new Error('detail day not define');
      }
      let obj = result.find((item) => item.time === time);
      if (obj === undefined) {
        result.push({ time, count: 1 });
      } else {
        obj.count++;
      }
    }
  });
  return result;
};

module.exports = { inValidChechInDashboard };
