let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let studentController = require('../src/controller/student');
const jwtFn = require('../src/middleware/auth');
const handleErrorAsync = require('../src/errorHandler/handleErrorAsync');

/* GET users listing. */
router.post('/v1/register', studentController.studentSignUp);

router.post('/v1/login', studentController.logIn);

router.patch('/v1/profile', jwtFn.isAuth, studentController.editInfo);

router.post('/v1/logout', jwtFn.isAuth, studentController.logOut);


module.exports = router;
