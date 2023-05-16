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
    // tính toán các thông tin như số thời gian lên cty,
    //các buồi chẹckin hợp lệ, tống số buối phải lên cty như đã đăng ký
    const checkInInfo = calculatorValidCheckIn(
      month,
      year,
      element.days,
      element.schedules,
    );
    return { ...checkInInfo, user: element };
  });
  return { users, conditions: { sort, page, limit, filter: prefilter } };
};

const destroyUser = async (userId) => {
  return await userDao.destroy(userId);
};
module.exports = {
  findUser,
  findUsersInfoPerMonth,
  destroyUser,
};
