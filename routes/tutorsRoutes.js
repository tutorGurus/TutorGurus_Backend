let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let tutorController = require('../src/controller/tutor');
const tutorBackgroundController = require('../src/controller/tutorBackgroundController');
const tutorScheduleController = require('../src/controller/tutorScheduleController');
const jwtFn = require('../src/middleware/auth');

/* GET users listing. */
router.post('/v1/register', tutorController.teacherSignUp);

router.post('/v1/login', tutorController.logIn);

router.patch('/v1/profile', jwtFn.isAuth, tutorController.editInfo);

router.post('/v1/logout', jwtFn.isAuth, tutorController.logOut);

router.get('/v1/profile', jwtFn.isAuth, tutorController.getUserInfo);

// 取得所有教師-背景資料
router.get('/v1/profile/tutorBackground', tutorBackgroundController.getAllTutorBackground);

// 取得單一教師-背景資料
router.get('/v1/:tutorId/profile/tutorBackground', jwtFn.isAuth, tutorBackgroundController.getTutorBackground);

// 修改單一教師-背景資料
router.patch('/v1/:tutorId/profile/tutorBackground', jwtFn.isAuth, tutorBackgroundController.updateTutorBackground);

// 取得單一教師 - 行事曆設定資料
router.get('/v1/:tutorId/scheduleAll', tutorScheduleController.getAllTutorsSchedule);

// 取得單一教師 - 行事曆設定資料(給定年、月、日)
router.get('/v1/:tutorId/schedule', tutorScheduleController.getSchedule);

// 修改單一教師 - 行事曆設定資料
router.patch('/v1/:tutorId/schedule', tutorScheduleController.updateSchedule);

// 取得單一教師 - 行事曆設定資料 (v-calendar 格式)
router.get('/v1/:tutorId/scheduleV', tutorScheduleController.getScheduleV);

// 修改單一教師 - 行事曆設定資料 (v-calendar 格式)
router.patch('/v1/:tutorId/scheduleV', tutorScheduleController.updateScheduleV);

// 刪除單一教師 - 單日時段時間設定 (v-calendar 格式)
router.patch('/v1/:tutorId/scheduleV/pull', tutorScheduleController.deleteScheduleV);

// 修改單一教師 - 常規行事曆設定資料 (v-calendar 格式)
router.patch('/v1/:tutorId/scheduleV/routine', tutorScheduleController.updateRoutineScheduleV);

module.exports = router;
