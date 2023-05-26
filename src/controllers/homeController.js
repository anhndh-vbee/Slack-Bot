const authController = require('./authController');
const home = (req, res) => {
  res.status(200).send('welcome to Check In app!');
};
const checkip = (req, res) => {
  clientIp = authController.checkIPv2(req, res);
  res.status(200).send({ clientIp });
};

module.exports = { home, checkip };
