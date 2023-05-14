let express = require('express');
let router = express.Router();
let bookingController = require('../src/controller/booking');
//const jwtFn = require('../src/middleware/auth');

// 學生查詢預約列表
router.get('/v1/booking ', bookingController.bookingList);

// 預約課程
router.post('/v1/booking', bookingController.bookingCourse);

// 老師查詢預約列表
router.get('/v1/booking/booked ', bookingController.bookedList);

// 請假、取消預約
router.patch('/v1/booking/:bookingId/status', bookingController.editBookingStatus);

// 修改課程 Zoom Link
router.patch('/v1/booking/:bookingId/zoom_link', bookingController.editZoomLink);

module.exports = router;
