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



module.exports = router;