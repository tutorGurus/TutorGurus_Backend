let express = require('express');
let router = express.Router();
let tutorInfosController = require('../src/controller/tutorInfo');

// 教師一覽
router.get('/', tutorInfosController.tutorsList);

// 教師詳情
router.get('/detail', tutorInfosController.tutorDetail);

module.exports = router;
