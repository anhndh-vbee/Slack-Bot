const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/add-user', userController.addUser)
router.get('/users', userController.getUser)

router.post('/', userController.saveUserFromSlack)
router.post('/list-users', userController.showListUsers)
router.post('/checkin', userController.checkIn)
router.get('/users-checkin', userController.postCheckIn)

module.exports = router;
