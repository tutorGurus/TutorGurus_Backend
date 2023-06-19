let express = require('express');
let router = express.Router();
let coursesController = require('../src/controller/coursesController');
const jwtFn = require('../src/middleware/auth');

// 新增一筆課程
router.post('/', jwtFn.isAuth, coursesController.createCourse);

// 取得該教師開設的所有課程
router.get('/', jwtFn.isAuth, coursesController.getAllCourses);

//課程一覽(首頁篩選想學課程)
router.get('/courseList', coursesController.courseListWithFilter);

//取得課程種類價格
router.get('/getPriceList', jwtFn.isAuth, coursesController.getClassPrice);

// 取得一筆課程資訊
router.get('/:courseId', jwtFn.isAuth, coursesController.getCourse);

// 修改一筆課程
router.patch('/:courseId', jwtFn.isAuth, coursesController.updateCourse);

// 刪除一筆課程
router.delete('/:courseId', jwtFn.isAuth, coursesController.deleteCourse);

//課程價格設定
router.post('/classPrice', jwtFn.isAuth, coursesController.newClassPrice);

//修改課程價格
router.patch('/edit/classPrice', jwtFn.isAuth, coursesController.editClassPrice);

//刪除課程類別
router.delete('/delete/classPrice', jwtFn.isAuth, coursesController.deleteClassPrice);


module.exports = router;