const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
/**
 * Find list users by conditions
 * @param {Object} condition - Conditions to find users
 * @returns {User[]} - List users match
 */
const find = async ({
  filter = {},
  sort = { createdAt: -1 },
  startIndex = 0,
  limit = null,
}) => {
  const query = User.find(filter).sort(sort).skip(startIndex);
  if (limit !== null) {
    query.limit(limit);
  }
  const total = await User.countDocuments(filter);
  const data = await query.exec();
  return { total, data };
};

/**
 * Delete founded User
 * @param {ObjectId} _id - User Id
 * @returns {ObjectId|null} - Deleted User or null if User not found
 */
const destroy = async (_id) => {
  if (!ObjectId.isValid(_id)) throw new CustomError(errorCodes.BAD_REQUEST);
  return await User.findByIdAndDelete(_id);
};
module.exports = { find, destroy };
