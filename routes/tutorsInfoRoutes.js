let express = require('express');
let router = express.Router();
let tutorInfosController = require('../src/controller/tutorInfos');
//const jwtFn = require('../src/middleware/auth');

router.get('/v1/tutorsInfo ', tutorInfosController.tutorsList);

router.get('/v1/tutorsInfo/:tutorID', tutorInfosController.tutorDetail);



module.exports = router;
