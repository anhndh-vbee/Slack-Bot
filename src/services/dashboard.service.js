const userDao = require('../daos/user.dao');
const {
  handlerLateDashboardData,
} = require('../data-handler/handlerLateDashboardData');
const { getDatesOrMonthsInRange } = require('../utils/getDatesOrMonthsInRange');

const lateCheckIn = async (conditions) => {
  const { startTime, endTime, detail } = conditions;
  const users = await userDao.find({});
  const startTimeObject = new Date(Date.parse(startTime));
  const endTimeObject = new Date(Date.parse(endTime));
  let days = [];

  users.data.forEach((element) => {
    const elementDays = element.days.filter(
      (e) => e[0] >= startTimeObject && e[0] <= endTimeObject,
    );
    days = [...elementDays, ...days];
  });
  let listTime = getDatesOrMonthsInRange(startTimeObject, endTimeObject, detail);
  const late = handlerLateDashboardData(detail, days, listTime);
  const invalidCheckInTotal = late.reduce(
    (accumulator, currentValue) => accumulator + currentValue[1],
    0,
  );
  return { late, invalidCheckInTotal };
};

module.exports = {
  lateCheckIn,
};
