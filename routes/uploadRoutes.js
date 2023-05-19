const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../src/middleware/imageMiddleware');
const jwtFn = require('../src/middleware/auth');
const fileProcess = require('../src/controller/imageController');

router.post('/file',jwtFn.isAuth ,uploadMiddleware, fileProcess.uploadImage)

router.post('/file/remove', jwtFn.isAuth, fileProcess.removeImage)

module.exports = router;
