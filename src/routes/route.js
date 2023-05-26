const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const dashboardRoute = require('./dashboard.route');
const downloadRoute = require('./download.route');
const homeRoue = require('./home.route');
const asyncMiddleware = require('../middlewares/async.middleware');
const { adminAuthorization } = require('../middlewares/auth.middleware');
const handlerSlackTextMiddleware = require('../middlewares/handlerSlackText.middleware');

router.use(homeRoue);
router.use(downloadRoute);

router.post('/save', userController.saveUserFromSlack);
router.post('/checkin', userController.checkIn);
router.get('/user-checkin/:token', userController.postCheckIn);
router.post('/user/schedule', userController.schedule);

// addmin role
router.use(adminAuthorization);

router.post('/users', asyncMiddleware(userController.index));

// slack process minddleware
router.use(handlerSlackTextMiddleware);
router.post('/users/timekeeping', asyncMiddleware(userController.infoPerMonth));
router.post('/users/destroy', asyncMiddleware(userController.destroy));
router.use('/dashboard', dashboardRoute);

module.exports = router;
