const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/add-user', userController.addUser)
router.get('/users', userController.getUser)
router.put('/edit-user/:id', userController.updateUser)

router.post('/', userController.checkUserInfo)
router.post('/list-users', userController.showListUsers)
router.post('/checkin', userController.checkIn)
module.exports = router;
