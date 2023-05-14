const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');

/**
 * Find list users by conditions
 * @param {Object} condition - Conditions to find users
 * @returns {User[]} - List users match
 */
const find = async ({
  filter = {},
  sort = { createdAt: -1 },
  startIndex = 0,
  limit = process.env.LIMIT,
}) => {
  const query = User.find(filter).sort(sort).skip(startIndex).limit(limit);
  const total = await User.countDocuments(filter);
  const data = await query.exec();
  return { total, data };
};

module.exports = { find };
