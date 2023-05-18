const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const asyncMiddleware = require('../middlewares/async.middleware');

router.get('/download/:filename', asyncMiddleware(downloadController.lateCheckIn));

module.exports = router;
