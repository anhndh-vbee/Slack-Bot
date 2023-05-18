const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const asyncMiddleware = require('../middlewares/async.middleware');
const dashboardRoute = require('./dashboard.route');
const { adminAuthorization } = require('../middlewares/auth.middleware');
const handlerSlackTextMiddleware = require('../middlewares/handlerSlackText.middleware');
const publicDirecPath = require('../config/publicDirecPath');
router.post('/', userController.saveUserFromSlack);

router.post('/checkin', userController.checkIn);
router.get('/user-checkin/:token', userController.postCheckIn);

router.post('/user/schedule', userController.schedule);

// router.use(adminAuthorization);

router.post(
  '/users/timekeeping',
  handlerSlackTextMiddleware,
  asyncMiddleware(userController.infoPerMonth),
);
router.post('/users/:userId/destroy', asyncMiddleware(userController.destroy));
router.post('/users', asyncMiddleware(userController.index));

router.use('/dashboard', dashboardRoute);

const fs = require('fs');
router.get('/download/:filename', (req, res) => {
  const file = fs.readFileSync(publicDirecPath + `/${req.params.filename}`);
  res.setHeader('Content-disposition', 'attachment; filename=example.xlsx');
  res.setHeader(
    'Content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.send(file);
});
module.exports = router;
