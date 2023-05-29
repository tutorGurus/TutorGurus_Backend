var express = require('express');
var router = express.Router();
const orderController = require('../src/controller/orderController');
const jwtFn = require('../src/middleware/auth');

//新增訂單路由
router.post('/v1/order',jwtFn.isAuth ,orderController.createNewOrder);

//獲取訂單路由
router.get('/v1/order/test',jwtFn.isAuth ,orderController.getOrder);

module.exports = router;