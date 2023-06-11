const express = require('express');
const router = express.Router();
const cartController = require('../src/controller/cartController');
const jwtFn = require('../src/middleware/auth');

//修改購物車列表
router.post('/v1/:coursesID/cart', jwtFn.isAuth, cartController.addCartContent);

//獲取購物車
router.get('/v1/cart', jwtFn.isAuth, cartController.getCartContent);

//刪除購物車項目
router.delete('/v1/:coursesID/cart',jwtFn.isAuth , cartController.deleteCartContent);



module.exports = router;

