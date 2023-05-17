const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const asyncMiddleware = require('../middlewares/async.middleware');
const dashboardRoute = require('./dashboard.route');
const { adminAuthorization } = require('../middlewares/auth.middleware');
router.post('/', userController.saveUserFromSlack);

router.post('/checkin', userController.checkIn);
router.get('/user-checkin/:token', userController.postCheckIn);

router.post('/user/schedule', userController.schedule);

router.use(adminAuthorization);

router.get(
  '/users/:month-:year',
  asyncMiddleware(userController.infoPerMonth),
);
router.post('/users/:userId/destroy', asyncMiddleware(userController.destroy));
router.get('/users', asyncMiddleware(userController.index));


router.use('/dashboard', dashboardRoute);

module.exports = router;
