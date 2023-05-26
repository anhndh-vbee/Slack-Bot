const authService = require('../services/auth.service');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const asyncMiddleware = require('./async.middleware');

const adminAuthorization = async (req, res, next) => {
  const { user_id } = req.body;
  const user = await authService.verify(user_id);
  if (user.role !== 'admin') throw new CustomError(errorCodes.FORBIDDEN);
  return next();
};

module.exports = {
  adminAuthorization: asyncMiddleware(adminAuthorization),
};
