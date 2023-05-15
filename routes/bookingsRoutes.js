let express = require('express');
let router = express.Router();
let bookingController = require('../src/controller/booking');
const jwtFn = require('../src/middleware/auth');

// 學生查詢預約列表
router.get('/', jwtFn.isAuth, bookingController.bookingList);

// 預約課程
router.post('/', jwtFn.isAuth, bookingController.bookingCourse);

// 老師查詢預約列表
router.get('/booked', jwtFn.isAuth, bookingController.bookedList);

// 請假、取消預約
router.patch('/status', jwtFn.isAuth, bookingController.editBookingStatus);

// 修改課程 Zoom Link
router.patch('/zoom_link', jwtFn.isAuth, bookingController.editZoomLink);

module.exports = router;
