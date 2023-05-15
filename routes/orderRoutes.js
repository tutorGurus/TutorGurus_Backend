var express = require('express');
var router = express.Router();
const orderController = require('../src/controller/orderController');
const jwtFn = require('../src/middleware/auth');


router.post('/v1/order', orderController.createNewOrder);

router.post('/v1/order/test', orderController.getOrder);

module.exports = router;