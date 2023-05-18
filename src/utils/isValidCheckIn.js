const isValidCheckIn = (checkInTime, checkOutTime) => {
  // kiểm tra check in hợp lệ với điều kiện là check in
  // trước 8h30 sáng đến  check out 12h , check in trước
  // 8h30 sáng check out sau 17h30 chiều, check in 12h đến
  // 11h15 checkout sau 17h30  là khoảng thời gian hợp lệ

  const year = checkInTime.getFullYear();
  const month = checkInTime.getMonth();
  const date = checkInTime.getDate();

  // check in hợp lệ sang
  const validCheckInTime1 = new Date(Date.UTC(year, month, date, 8, 30, 0))

  // check in hợp lệ chieu
  const validCheckInTime2 = new Date(Date.UTC(year, month, date, 12, 0, 0));

  const validCheckInTime3 = new Date(Date.UTC(year, month, date, 13, 15, 0));

  // check out hợp lệ sang
  const validCheckOutTime1 = new Date(Date.UTC(year, month, date, 12, 0, 0));

  const validCheckOutTime2 = new Date(Date.UTC(year, month, date, 13, 15, 0));

  // check out hợp lệ chieu
  const validCheckOutTime3 = new Date(Date.UTC(year, month, date, 17, 30, 0));

  let isValid = false;
  let time;
  let isValidCheckInTime = false;
  let isValidCheckOutTime = false;
  let isCheckInMorning = false;
  let isCheckoutMorning = false;

  // Kiểm tra thời gian check in
  if (
    checkInTime <= validCheckInTime1 || // check in trước 8h30 sáng
    (checkInTime >= validCheckInTime2 && checkOutTime <= validCheckInTime3) // check in 12h đến 13h15
  ) {
    isValidCheckInTime = true;
    // check in sang valid
    if (checkInTime <= validCheckInTime1) {
      isCheckInMorning = true;
    }
  }

  // Kiểm tra thời gian check out
  if (
    (checkOutTime >= validCheckOutTime1 &&
      checkOutTime <= validCheckOutTime2) || // check out 12h đến 13h15 chiều
    checkOutTime >= validCheckInTime3 // check out sau 17h30
  ) {
    isValidCheckOutTime = true;
    if (!(checkOutTime >= validCheckInTime3)) {
      isCheckoutMorning = true;
    }
  }

  if (isValidCheckInTime && isValidCheckOutTime) {
    isValid = true;
    if (isCheckInMorning && isCheckoutMorning) {
      time = 'morning';
    }
    if (isCheckInMorning && !isCheckoutMorning) {
      time = 'full';
    }
    if (!isCheckInMorning && !isCheckoutMorning) {
      time = 'afternoon';
    }
    if (!isCheckInMorning && isCheckoutMorning) {
      isValid = false;
      time = null;
    }
  }
  return { isValid, time };
};

module.exports = { isValidCheckIn };
