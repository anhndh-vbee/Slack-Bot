const schedule = require('../config/schedule');
const { compareObjects } = require('./compare');

const convertedScheduleCode = ({ time, day }) => {
  let result;
  result = schedule.find((element) => {
    const elementObject = {
      time: element.object.time,
      day: element.object.day,
    };
    return compareObjects({ time, day }, element.object);
  });
  if (schedule === undefined) return null;
  return result.code;
};
const convertedScheduleObject = (code) => {
  let result;
  result = schedule.find((element) => element.code === code);
  if (schedule === undefined) return null;
  return result.object;
};

module.exports = { convertedScheduleCode, convertedScheduleObject };
