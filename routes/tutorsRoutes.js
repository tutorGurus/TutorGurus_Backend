let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let tutorController = require('../src/controller/tutor');
const tutorBackgroundController = require('../src/controller/tutorBackgroundController');
const tutorScheduleController = require('../src/controller/tutorScheduleController');
let tutorInfosController = require('../src/controller/tutorInfo');
const jwtFn = require('../src/middleware/auth');

/* GET users listing. */
//老師註冊
router.post('/v1/register', tutorController.teacherSignUp);

//老師修改個人資料
router.patch('/v1/profile', jwtFn.isAuth, tutorController.editInfo);

// 教師一覽
router.get('/', tutorInfosController.tutorsList);

// 教師詳情
router.get('/detail', tutorInfosController.tutorDetail);

// 取得所有教師-背景資料
router.get('/v1/profile/tutorBackground', tutorBackgroundController.getAllTutorBackground);

// 取得單一教師-背景資料
router.get('/v1/:tutorId/profile/tutorBackground', jwtFn.isAuth, tutorBackgroundController.getTutorBackground);

// 修改單一教師-背景資料
router.patch('/v1/:tutorId/profile/tutorBackground', jwtFn.isAuth, tutorBackgroundController.updateTutorBackground);

// 取得單一教師 - 所有年、月份行事曆設定資料
router.get('/v1/scheduleAll', jwtFn.isAuth, tutorScheduleController.getAllTutorsSchedule);

// 取得單一教師 - 行事曆設定資料(給定年、月、日)
router.get('/v1/schedule', jwtFn.isAuth, tutorScheduleController.getSchedule);

// 修改單一教師 - 行事曆設定資料
router.patch('/v1/schedule', jwtFn.isAuth, tutorScheduleController.updateSchedule);

// 取得單一教師 - 行事曆設定資料 (v-calendar 格式)
router.get('/v1/scheduleV', jwtFn.isAuth, tutorScheduleController.getScheduleV);

// 修改單一教師 - 行事曆設定資料 (v-calendar 格式)
router.patch('/v1/scheduleV', jwtFn.isAuth, tutorScheduleController.updateScheduleV);

// 刪除單一教師 - 單日時段時間設定 (v-calendar 格式)
router.patch('/v1/scheduleV/pull', jwtFn.isAuth, tutorScheduleController.deleteScheduleV);

// 修改單一教師 - 常規行事曆設定資料 (v-calendar 格式)
router.patch('/v1/scheduleV/routine', jwtFn.isAuth, tutorScheduleController.updateRoutineScheduleV);

module.exports = router;
