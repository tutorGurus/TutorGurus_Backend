const express = require('express');
const router = express.Router();
const jwtFn = require('../src/middleware/auth');
const commonProcess = require('../src/controller/commonController');
const passport = require('../src/middleware/passportValidate');
const gmailController = require('../src/service/gmailAPI');

//goolge教師登入or註冊
router.get('/v1/T/register/google', passport.authenticate('google-teacher', {
    scope : ['email', 'profile']
}));

//goolge學生登入or註冊
router.get('/v1/S/register/google', passport.authenticate('google-student', {
    scope : ['email', 'profile']
}));

//google登入後重導向教師位置
router.get('/v1/T/google/callback', passport.authenticate('google-teacher', { session: false }), commonProcess.googlelogIn);

//一般註冊路由]
router.post('/v1/register', commonProcess.signUp);

//google登入後重導向學生位置
router.get('/v1/S/google/callback',  passport.authenticate('google-student', { session: false }), commonProcess.googlelogIn);

//登入路由
router.post('/v1/login', commonProcess.logIn);

//登出路由
router.post('/v1/logout', jwtFn.isAuth, commonProcess.logOut);

//獲取資料路由
router.get('/v1/profile', jwtFn.isAuth, commonProcess.getUserInfo);

//修改個人資料路由
router.patch('/v1/profile', jwtFn.isAuth, commonProcess.editUserInfo);

//忘記密碼發信API
router.post('/forgetPassword/gmail', gmailController.sendForgetMail);



module.exports = router;