const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/", userController.saveUserFromSlack);

router.post("/checkin", userController.checkIn);
router.get("/user-checkin/:token", userController.postCheckIn);

router.post("/user/schedule", userController.schedule);

module.exports = router;
