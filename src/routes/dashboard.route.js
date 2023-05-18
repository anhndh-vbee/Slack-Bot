const express = require('express');
const asyncMiddleware = require('../middlewares/async.middleware');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.post('/late-check-in', asyncMiddleware(dashboardController.lateCheckIn));

module.exports = router;
