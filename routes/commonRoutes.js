const express = require('express');
const router = express.Router();
const jwtFn = require('../src/middleware/auth');
const commonProcess = require('../src/controller/commonController');
const passport = require('../src/middleware/passportValidate');
const customiError = require('../src/errorHandler/customiError');


//goolge登or註冊
router.get('/v1/register/google/:role',(req, res, next) =>{
    if(req.params['role'] !== 'T' && req.params['role'] !== 'S'){
        return next(customiError(400, "路由錯誤(未填入正確的身分類別)"));
    } else {
        req.role = req.params['role'];
        next();
    }
}, passport.authenticate('google', {
    scope : ['email', 'profile']
}));

//google登入後重導向位置
router.get('/v1/google/callback', passport.authenticate('google', 
{ session: false }), commonProcess.googlelogIn);

//一般註冊
router.post('/v1/register', commonProcess.SignUp)

//一般登入API
router.post('/v1/login', commonProcess.logIn);

//登出API
router.post('/v1/logout', jwtFn.isAuth, commonProcess.logOut);

//修改資料API
router.patch('/v1/profile', jwtFn.isAuth, commonProcess.editInfo);

//獲取資料API
router.get('/v1/profile', jwtFn.isAuth, commonProcess.getUserInfo);

module.exports = router;