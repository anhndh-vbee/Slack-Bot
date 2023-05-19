// get week of date
function getWeek(date) {
  const weekStart = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - weekStart.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

const date = new Date();
console.log(getWeek(date));
// const cron = require('cron');
// const cronJob = new cron.CronJob('0 9 1-7 Jan *', () => {
//   const currentDate = new Date();
//   const firstDayOfMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth(),
//     2,
//   );
//   const firstSundayOfMonth =
//     firstDayOfMonth.getDate() + (7 - firstDayOfMonth.getDay());
//   if (
//     currentDate.getMonth() === 0 &&
//     currentDate.getDate() === firstSundayOfMonth
//   ) {
//     console.log(1);
//   }
// });

// cronJob.start();
