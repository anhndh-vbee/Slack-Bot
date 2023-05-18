const _ = require('lodash');

const compareObjects = (obj1, obj2) => {
  return _.isEqual(obj1, obj2);
};

module.exports = { compareObjects };
