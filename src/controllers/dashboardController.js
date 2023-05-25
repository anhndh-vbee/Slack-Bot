const { lateChartResponse } = require('../excel-processing/lateChart.excel');
const dashboardService = require('../services/dashboard.service');

const lateCheckIn = async (req, res) => {
  const condition = req.query;
  const checkInInfomation = await dashboardService.lateCheckIn(condition);
  const resData = await lateChartResponse(req, res, checkInInfomation.late);
  res.status(200).send(resData);
};
module.exports = {
  lateCheckIn,
};
