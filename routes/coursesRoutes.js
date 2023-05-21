let express = require('express');
let router = express.Router();
let coursesController = require('../src/controller/courses');
//const jwtFn = require('../src/middleware/auth');

// 新增一筆課程
router.post('/', coursesController.createCourse);

// 取得所有課程資訊
router.get('/', coursesController.getAllCourses);

// 取得一筆課程資訊
router.get('/:courseId', coursesController.getCourse);

// 修改一筆課程
router.patch('/:courseId', coursesController.updateCourse);

// 刪除一筆課程
router.delete('/:courseId', coursesController.deleteCourse);

module.exports = router;