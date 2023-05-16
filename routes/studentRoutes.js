let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let studentController = require('../src/controller/student');
const jwtFn = require('../src/middleware/auth');
const handleErrorAsync = require('../src/errorHandler/handleErrorAsync');

/* GET users listing. */
router.post('/v1/register', studentController.studentSignUp);

router.post('/v1/login', studentController.logIn);

router.post('/v1/logout', jwtFn.isAuth, studentController.logOut);

router.patch('/v1/profile', jwtFn.isAuth, studentController.editInfo);

router.get('/v1/profile', jwtFn.isAuth, studentController.getUserInfo);

router.get('/test', (req, res, next) => {
    res.send({
        status : "success",
        message : "測試用！"
    })
})



module.exports = router;
