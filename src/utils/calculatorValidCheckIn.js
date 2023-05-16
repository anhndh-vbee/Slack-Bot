const { isValidCheckIn } = require('./isValidCheckIn');

const getDaysInMonth = (month, year) => {
  const date = new Date(Date.UTC(year, month, 1));
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const calculatorValidCheckIn = (month, year, days, schedule) => {
  // days = [[time, time], [time, time], ]
  // schedule = [{time: 'morning || afternoon', day: ''}]
  const dayOfWeekNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  var numberValidCheckIn = 0;
  var upTheCompanyCount = 0;
  var totalTime = 0;
  // so buoi le cty theo dung lich trinh
  var schedCheckins = 0;
  // kiểm tra tháng đó có tổng bao nhiêu buổi lên công ty
  const dayInMonth = getDaysInMonth(parseInt(month) - 1, parseInt(year));
  const totalMonthlyVisits = dayInMonth.reduce((total, element) => {
    const day = dayOfWeekNames[element.getDay()];
    if (schedule.some((scheduleElement) => scheduleElement.day === day)) {
      return ++total;
    }
    return total;
  }, 0);
  days.forEach((element) => {
    if (
      element[0].getMonth() + 1 === parseInt(month) &&
      element[0].getFullYear() === parseInt(year)
    ) {
      upTheCompanyCount++;
      const checkInTime = element[0];
      const checkOutTime = element[element.length - 1];
      const day = dayOfWeekNames[checkInTime.getDay()];
      const { isValid, time } = isValidCheckIn(checkInTime, checkOutTime);

      //check in valid in company
      isValid && numberValidCheckIn++;
      // total time in company
      isValid &&
        (totalTime += ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(
          2,
        ));

      // check in valid by schedule
      if (
        schedule.some((element) => element.time === time && element.day === day)
      )
        schedCheckins++;
    }
  });
  return {
    upTheCompanyCount,
    numberValidCheckIn,
    totalTime,
    schedCheckins,
    totalMonthlyVisits,
  };
};

module.exports = { calculatorValidCheckIn };
