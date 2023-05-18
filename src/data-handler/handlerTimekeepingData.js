const { compareObjects } = require('../utils/compare');
const { getDaysInMonth } = require('../utils/getDayInMonth');
const { getDayOfWeekName } = require('../utils/getDayOfWeekName');
const { isValidCheckIn } = require('../utils/isValidCheckIn');
const { roundNumber } = require('../utils/roundNumber');

const handlerTimekeepingData = (month, year, days, schedule) => {
  // days = [[time, time], [time, time], ]
  // schedule = [{time: 'morning || afternoon', day: ''}]

  //số lần lên công ty
  var dailyOfficeEntryCount = 0;

  // lưu số lượng check in thành công
  var validCheckInCount = 0;

  // tổng số giờ lên công ty
  var totalOfficeHours = 0;

  // số buối lên công ty đúng như lịch đã đăng ký
  var scheduledOfficeVisits = 0;

  // tổng số  buổi phải  lên công ty như lịch đã đăng ký
  var totalScheduledWorkingDaysInMonth = 0;

  // các ngày có trong tháng chỉ định
  const dayInMonth = getDaysInMonth({ month, year });

  // mảng dữ liệu các object ngày tháng, trong đó mỗi
  // object bao gồm thông tin về thời gian check in và check out của ngày đó.
  var checkInOutArr = dayInMonth.map((element) => {
    const day = getDayOfWeekName(element);

    if (schedule.some((scheduleElement) => scheduleElement.day === day)) {
      // nếu ngày trong tháng trùng với thời gian đăng ký trong lịch
      ++totalScheduledWorkingDaysInMonth;
    }

    // giá trị khởi tạo mảng check in checkout
    return {
      [element.getDate()]: { checkIn: '0:0', checkOut: '0:0' },
    };
  });
  days.forEach((element) => {
    const checkInTime = element[0];

    // tháng năm của phần tử thỏa mãn yêu cầu
    if (
      checkInTime.getMonth() + 1 === parseInt(month) &&
      checkInTime.getFullYear() === parseInt(year)
    ) {
      // có checkin là số ngày lên công ty sẽ thêm 1
      dailyOfficeEntryCount++;

      // lần checkin cuối cùng sẽ là checkout
      const checkOutTime = element[element.length - 1];

      // thông tin về ngày checkin
      const day = getDayOfWeekName(checkInTime);
      const date = checkInTime.getDate();

      // kiểm tra checkin checkout có hợp lệ không
      const { isValid, time } = isValidCheckIn(checkInTime, checkOutTime);

      if (isValid) {
        // check in check out hợp lệ
        validCheckInCount++;

        // tổng thời gian lên công ty trong tháng đó
        const hours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        totalOfficeHours += roundNumber(hours, 2);

        if (
          schedule.some((element) => {
            const elementWithOutId = { time: element.time, day: element.day };
            return compareObjects(elementWithOutId, { time, day });
          })
        )
          scheduledOfficeVisits++;
      }

      // thay đổi giá trị thời gian trong mảng checkin checkout
      var currentDay = checkInOutArr.find((obj) => obj.hasOwnProperty(date));
      currentDay[date] = {
        checkIn: checkInTime.getUTCHours() + ':' + checkInTime.getMinutes(),
        checkOut: checkOutTime.getUTCHours() + ':' + checkOutTime.getMinutes(),
      };
      // buổi lên cty hợp lệ hôm đó có đúng như lịch trình đăng ký lên cty
    }
  });
  return {
    checkInOutArr,
    dailyOfficeEntryCount,
    validCheckInCount,
    totalOfficeHours,
    scheduledOfficeVisits,
    totalScheduledWorkingDaysInMonth,
  };
};

module.exports = { handlerTimekeepingData };
