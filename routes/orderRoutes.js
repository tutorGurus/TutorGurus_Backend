var express = require('express');
var router = express.Router();
const orderController = require('../src/controller/orderController');
const jwtFn = require('../src/middleware/auth');


router.post('/v1/order',jwtFn.isAuth ,orderController.createNewOrder);

router.get('/v1/order/test',jwtFn.isAuth ,orderController.getOrder);

module.exports = router;