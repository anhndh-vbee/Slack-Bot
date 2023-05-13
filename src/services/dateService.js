// dateString: d-m-y
const getDetailDay = (dateString) => {
  const dateParts = dateString.split("-");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1; // Months are zero-indexed, so subtract 1
  const day = parseInt(dateParts[0]);
  const date = new Date(year, month, day);
  const options = { weekday: "long" };
  const dayOfWeek = date.toLocaleDateString("en-US", options);
  return dayOfWeek;
};

const getDayOfWeek = (number) => {
  const daysOfWeek = [
    "Saturday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const dayIndex = (number % 6) - 1;
  return daysOfWeek[dayIndex];
};

module.exports = { getDetailDay, getDayOfWeek };
