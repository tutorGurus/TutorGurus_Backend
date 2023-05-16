const Order = require('../models/orderModel');
const customiError = require("../errorHandler/customiError");
const successHandle = require('../service/successHandler');
const jwtFn = require('../middleware/auth');

let orderController = {
    
    async  createNewOrder(req, res, next){
        try {
            let { id, courseId, totalPrice} = req.body;
            if( !courseId || !totalPrice){
                return next(customiError(400, "訂單資訊不完全"));
            }
            let newOrder = await Order.create({
                user_id : id,
                course_id : courseId,
                total_price : totalPrice
            })
            console.log(newOrder);
            successHandle(res, newOrder);
        } catch(err){
            console.log(err);
        }
    },


    async getOrder(req, res, next){
        try{
            let { id } = req.body;
            const orders = await Order.find({ user_id : id });
            successHandle(res, orders);
        } catch(err){
            
        }
    }
    
}

module.exports = orderController;