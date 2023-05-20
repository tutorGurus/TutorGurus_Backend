let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let tutorController = require('../src/controller/tutor');
const tutorBackgroundController = require('../src/controller/tutorBackgroundController');
const jwtFn = require('../src/middleware/auth');

/* GET users listing. */
router.post('/v1/register', tutorController.teacherSignUp);

router.post('/v1/login', tutorController.logIn);

router.patch('/v1/profile', jwtFn.isAuth, tutorController.editInfo);

router.post('/v1/logout', jwtFn.isAuth, tutorController.logOut);

router.get('/v1/profile', jwtFn.isAuth, tutorController.getUserInfo);

// 取得所有教師的背景資料
router.get('/v1/profile/tutorBackground', tutorBackgroundController.getAllTutorBackground);

// 取得單一教師的背景資料
router.get('/v1/:tutorId/profile/tutorBackground', jwtFn.isAuth, tutorBackgroundController.getTutorBackground);

// 修改單一教師的背景資料
router.patch('/v1/:tutorId/profile/tutorBackground', jwtFn.isAuth, tutorBackgroundController.updateTutorBackground);

module.exports = router;
