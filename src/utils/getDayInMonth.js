const getDaysInMonth = ({ month, year }) => {
  // validate data
  if (typeof month === 'string') {
    month = parseInt(month);
  }
  if (typeof year === 'string') {
    year = parseInt(year);
  }
  // convert month in js
  month -= 1;
  const date = new Date(Date.UTC(year, month, 1));
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

module.exports = { getDaysInMonth };
