let express = require('express');
let router = express.Router();
let User = require('../src/models/userModel');
let studentController = require('../src/controller/student');
const jwtFn = require('../src/middleware/auth');
const handleErrorAsync = require('../src/errorHandler/handleErrorAsync');

/* GET users listing. */
router.post('/v1/register', studentController.studentSignUp);


router.get('/test', (req, res, next) => {
    res.send({
        status : "success",
        message : "測試用！"
    })
})



module.exports = router;
