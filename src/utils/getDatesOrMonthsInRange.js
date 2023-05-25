const getDatesOrMonthsInRange = (startDate, endDate, dataType) => {
  let results = [];
  switch (dataType) {
    case 'day':
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        results.push([`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, 0]);
      }
      break;
    case 'month':
      for (
        let date = startDate;
        date <= endDate;
        date.setMonth(date.getMonth() + 1)
      ) {
        results.push([`${date.getMonth() + 1}/${date.getFullYear()}`, 0]);
      }
      break;
    default:
      throw new Error('detail day not define');
  }
  return results;
};

module.exports = { getDatesOrMonthsInRange };
