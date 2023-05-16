const convertFilterToRegex = require('../utils/convertFilterToRegex');
const userDao = require('../daos/user.dao');
const { calculatorValidCheckIn } = require('../utils/calculatorValidCheckIn');

const findUser = async (conditions) => {
  const {
    sortField,
    sortOrder,
    page = process.env.PAGE,
    limit = process.env.LIMIT,
    ...prefilter
  } = conditions;
  // sort document
  let sort;
  if (typeof sortField !== 'undefined') sort = { [sortField]: sortOrder || -1 };
  // pagination
  let startIndex;
  if (typeof page !== 'undefined') {
    const currentPage = parseInt(page);
    startIndex = currentPage <= 0 ? 0 : (currentPage - 1) * limit;
  }
  const filter = convertFilterToRegex(prefilter);
  const users = await userDao.find({ filter, sort, startIndex, limit });
  return { users, conditions: { sort, page, limit, filter: prefilter } };
};

const findUsersInfoPerMonth = async (month, year, conditions) => {
  const {
    sortField,
    sortOrder,
    page = process.env.PAGE,
    limit = process.env.LIMIT,
    ...prefilter
  } = conditions;
  // sort document
  let sort;
  if (typeof sortField !== 'undefined') sort = { [sortField]: sortOrder || -1 };
  // pagination
  let startIndex;
  if (typeof page !== 'undefined') {
    const currentPage = parseInt(page);
    startIndex = currentPage <= 0 ? 0 : (currentPage - 1) * limit;
  }
  const filter = convertFilterToRegex(prefilter);
  var users = await userDao.find({ filter, sort, startIndex, limit });
  users.data = users.data.map((element) => {
    const checkInInfo = calculatorValidCheckIn(
      month,
      year,
      element.days,
      element.schedules,
    );
    console.log(checkInInfo);
    return {...checkInInfo, user: element};
  });
  return { users, conditions: { sort, page, limit, filter: prefilter } };
};
module.exports = {
  findUser,
  findUsersInfoPerMonth,
};
