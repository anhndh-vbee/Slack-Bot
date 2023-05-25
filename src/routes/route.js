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
router.post('/', userController.saveUserFromSlack);
router.post('/checkin', userController.checkIn);
router.get('/user-checkin/:token', userController.postCheckIn);

router.post('/user/schedule', userController.schedule);

router.use(adminAuthorization);

router.post(
  '/users/timekeeping',
  handlerSlackTextMiddleware,
  asyncMiddleware(userController.infoPerMonth),
);
router.post(
  '/users/destroy',
  handlerSlackTextMiddleware,
  asyncMiddleware(userController.destroy),
);
router.post('/users', asyncMiddleware(userController.index));
router.use('/dashboard', dashboardRoute);
router.use(downloadRoute);

module.exports = router;
