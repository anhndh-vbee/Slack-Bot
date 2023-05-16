const config = require('../config/config');
const dashboardService = require('../services/dashboard.service');

const lateCheckIn = async (req, res) => {
  const condition = req.query;
  const checkInInfomation = await dashboardService.lateCheckIn(condition);
  res.status(200).send(checkInInfomation);
};
module.exports = {
  lateCheckIn,
};
