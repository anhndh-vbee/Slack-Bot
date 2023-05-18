const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const userDao = require('../daos/user.dao');

const verify = async (userId) => {
  const user = await userDao.show({ id: userId });
  if (!user) throw new CustomError(errorCodes.NOT_FOUND);
  return user;
};

module.exports = { verify };
