let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let tutorController = require('../src/controller/tutor');
const jwtFn = require('../src/middleware/auth');

/* GET users listing. */
router.post('/v1/register', tutorController.teacherSignUp);

router.post('/v1/login', tutorController.logIn);

router.patch('/v1/profile', jwtFn.isAuth, tutorController.editInfo);

router.post('/v1/logout', jwtFn.isAuth, tutorController.logOut);

router.get('/v1/profile', jwtFn.isAuth, tutorController.getUserInfo);

module.exports = router;
