const Order = require('../models/orderModel');
const customiError = require("../errorHandler/customiError");
const successHandle = require('../service/successHandler');
const jwtFn = require('../middleware/auth');

let orderController = {
    
    async createNewOrder(req, res, next){
         /**
         * #swagger.tags = ['Order'],
         * #swagger.description = '新增訂單API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $courseId : 'courseId',
                    $totalPrice : "totalPrice",
                    $quantity : "quantity",
                }
            }
            #swagger.responses[200] = {
                description: '訂單新增成功成功',
                schema : {
                    "status": "success",
                    "data" : {
                        "order_date": "2023-05-16T08:18:32.610Z",
                        "quantity": 3,
                        "user_id": "userId",
                        "course_id": "courseId",
                        "total_price": "totalPrice",
                        "status": "訂單完成",
                        "_id": "64633c58bd1134fb95dd1a32",
                        "content": [],
                        "createdAt": "2023-05-16T08:18:32.616Z",
                        "updatedAt": "2023-05-16T08:18:32.616Z"
                    },
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            console.log(req.user);
            let { courseId, totalPrice, quantity} = req.body;
            if( !courseId || !totalPrice){
                return next(customiError(400, "訂單資訊不完全"));
            }
            let newOrder = await Order.create({
                
                order_date : new Date(),
                quantity : quantity,
                user_id : req.user['_id'],
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
            /**
         * #swagger.tags = ['Order'],
         * #swagger.description = '新增訂單API'
            #swagger.responses[200] = {
                description: '訂單新增成功成功',
                schema : {
                    "status": "success",
                    "data" :  [ {
                        "order_date": "2023-05-16T08:18:32.610Z",
                        "quantity": 3,
                        "user_id": "userId",
                        "course_id": "courseId",
                        "total_price": "totalPrice",
                        "status": "訂單完成",
                        "_id": "64633c58bd1134fb95dd1a32",
                        "content": [],
                        "createdAt": "2023-05-16T08:18:32.616Z",
                        "updatedAt": "2023-05-16T08:18:32.616Z"
                    } ],
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            const orders = await Order.find(
                { user_id : req.user["_id"] 
            });
            successHandle(res, orders);
        } catch(err){
            console.log(err);
        }
    }
    
}

module.exports = orderController;