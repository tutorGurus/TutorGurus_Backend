const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../src/middleware/imageMiddleware');
const jwtFn = require('../src/middleware/auth');
const fileProcess = require('../src/controller/imageController');

//上傳頭貼
router.post('/headshot',jwtFn.isAuth ,uploadMiddleware, fileProcess.uploadHeadImage);
//上傳背景
router.post('/backgroundImg', uploadMiddleware, fileProcess.uploadBackgroundImage);
//刪除頭貼
router.delete('/file/remove', jwtFn.isAuth, fileProcess.removeImage);

module.exports = router;
