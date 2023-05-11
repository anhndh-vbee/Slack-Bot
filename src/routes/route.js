const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/add-user", userController.addUser);
router.get("/users", userController.getUser);

router.post("/", userController.saveUserFromSlack);
router.post("/list-users", userController.showListUsers);

// v1
router.post("/checkin", userController.checkIn);
router.get("/users-checkin", userController.postCheckIn);

// v2
router.post("/checkinV2", userController.checkInV2);
router.get("/users-checkinv2/:token", userController.postCheckInV2);
// router.post("/user/schedule", userController.schedule);

module.exports = router;
