const roundNumber = (num, decimalPlaces) => {
  return parseFloat(num.toFixed(decimalPlaces));
};
module.exports = { roundNumber };
