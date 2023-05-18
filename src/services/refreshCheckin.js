const cron = require('cron');
const { update } = require('../daos/user.dao');

const cronJob = new cron.CronJob('0 9 1-7 Jan *', () => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    2,
  );
  const firstSundayOfMonth =
    firstDayOfMonth.getDate() + (7 - firstDayOfMonth.getDay());
  if (
    currentDate.getMonth() === 0 &&
    currentDate.getDate() === firstSundayOfMonth
  ) {
    update();
  }
});

cronJob.start();
