let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let tutorController = require('../src/controller/tutor');
const jwtFn = require('../src/middleware/auth');

/* GET users listing. */
router.post('/v1/register', tutorController.teacherSignUp);

router.post('/v1/login', tutorController.logIn);

router.patch('/v1/profile', jwtFn.isAuth, tutorController.editInfo);

module.exports = router;
