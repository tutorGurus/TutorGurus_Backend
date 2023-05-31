let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let studentController = require('../src/controller/student');
const jwtFn = require('../src/middleware/auth');
const handleErrorAsync = require('../src/errorHandler/handleErrorAsync');

/* GET users listing. */
//學生註冊路由
router.post('/v1/register', studentController.studentSignUp);

//學生修改個資路由
router.patch('/v1/profile', jwtFn.isAuth, studentController.editInfo);

//獲取學生個資路由
// router.get('v1/profile', jwt.isAuth, )





module.exports = router;
