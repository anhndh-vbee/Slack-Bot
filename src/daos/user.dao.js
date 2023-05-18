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
 * Show detail of User
 * @param {ObjectId|Object} condition - User Id or User object fields
 * @returns {User|null} - Found User or null if not found
 */
const show = async (condition) => {
  if (ObjectId.isValid(condition)) return await User.findById(condition);
  if (typeof condition === 'object' && condition !== undefined)
    return await User.findOne(condition);
  return null;
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

const update = async () => {
  await User.updateMany({}, { $set: { days: [] } });
};

module.exports = { find, update, show, destroy };
