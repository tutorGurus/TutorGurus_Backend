let express = require('express');
let router = express.Router();
let tutorInfosController = require('../src/controller/tutorInfos');
//const jwtFn = require('../src/middleware/auth');

// 教師一覽
router.get('/v1/tutorsInfo ', tutorInfosController.tutorsList);

// 教師詳情
router.get('/v1/tutorsInfo/:tutorID', tutorInfosController.tutorDetail);



module.exports = router;
