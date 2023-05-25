const { isValidCheckIn } = require('../utils/isValidCheckIn');

const handlerLateDashboardData = (detail, days, listTime) => {
  // days = [[time, time], [time, time], ]
  let result = listTime;
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
      let obj = result.find((item) => item[0] === time);
      if (obj === undefined) {
        result.push([time, 1 ]);
      } else {
        obj[1]++;
      }
    }
  });
  return result;
};

module.exports = { handlerLateDashboardData };
