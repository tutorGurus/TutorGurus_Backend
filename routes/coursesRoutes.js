let express = require('express');
let router = express.Router();
let coursesController = require('../src/controller/coursesController');
const jwtFn = require('../src/middleware/auth');;

// 新增一筆課程
router.post('/', jwtFn.isAuth, coursesController.createCourse);

// 取得所有課程資訊
router.get('/', jwtFn.isAuth, coursesController.getAllCourses);

// 取得一筆課程資訊
router.get('/:courseId', jwtFn.isAuth, coursesController.getCourse);

// 修改一筆課程
router.patch('/:courseId', jwtFn.isAuth, coursesController.updateCourse);

// 刪除一筆課程
router.delete('/:courseId', jwtFn.isAuth,coursesController.deleteCourse);

module.exports = router;