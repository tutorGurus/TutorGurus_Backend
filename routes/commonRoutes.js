const express = require('express');
const router = express.Router();
const jwtFn = require('../src/middleware/auth');
const commonProcess = require('../src/controller/commonController');
const passport = require('../src/middleware/passportValidate');

//goolge登入or註冊
router.get('/v1/register/google', passport.authenticate('google', {
    scope : ['email', 'profile']
}));

//google登入後重導向位置
router.get('/v1/google/callback', passport.authenticate('google', { session: false }), commonProcess.googlelogIn);

//登入路由
router.post('/v1/login', commonProcess.logIn);

//登出路由
router.post('/v1/logout', jwtFn.isAuth, commonProcess.logOut);

//獲取資料路由
router.get('/v1/profile', jwtFn.isAuth, commonProcess.getUserInfo);



module.exports = router;