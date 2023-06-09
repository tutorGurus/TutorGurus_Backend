const Courses = require('../models/coursesModel');
const User = require('../models/userModel');
const successHandle = require('../service/successHandler');
const customiError = require('../errorHandler/customiError');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

let cartController = {
    //獲取購物車內容
    async getCartContent(req, res, next){
        /**
         * #swagger.tags = ['Carts'],
         * #swagger.description = '取得購物車API'
            #swagger.responses[200] = {
                description: '取得成功',
                schema : {
                    "status": "success",
                    "data" : [
                        {
                            "cart": {
                                "_id": "courseId",
                                "user_id": "userId",
                                "title": "courseName",
                                "category": "courseCetegory",
                                "price": "2000",
                                "introduction": "testIntroduction",
                                "is_publish": true,
                                "createdAt": "2023-05-15T02:37:16.453Z",
                                "updatedAt": "2023-05-15T02:37:16.453Z"
                            },
                            "quantity": "quantity",
                            "_id": "646320f6802f949dbebcc869"
                        }
                    ]
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        let cartList = req.user.carts;
        successHandle(res,cartList);
    },

    //新增購物車內容
    async addCartContent(req, res, next){
        /**
         * #swagger.tags = ['Carts'],
         * #swagger.description = '新增與修改購物車API'
         * #swagger.parameters['coursesID'] = {
                    in: 'path',
                    description: 'Course ID.' 
            }
            #swagger.parameters['quantity'] = {
                in : 'query',
                description : '數量',
                required : true
            }
            #swagger.responses[200] = {
                description: '取得成功',
                schema : {
                    "status": "success",
                    "data" : [
                        {
                            "cart": {
                                "_id": "courseId",
                                "user_id": "userId",
                                "title": "courseName",
                                "category": "courseCetegory",
                                "price": "2000",
                                "introduction": "testIntroduction",
                                "is_publish": true,
                                "createdAt": "2023-05-15T02:37:16.453Z",
                                "updatedAt": "2023-05-15T02:37:16.453Z"
                            },
                            "quantity": "quantity",
                            "_id": "646320f6802f949dbebcc869"
                        }
                    ]
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            let { coursesID } = req.params;
            let { quantity } = req.query;
            const findCourse = await Courses.findById(coursesID);
            if(!quantity)
                return next(customiError(400, "請填入購買數量"));
            if(!findCourse)
                return next(customiError(400,"找不到該商品資訊"));
            let newCartContent
            let course = await User.findOne({ carts : { $elemMatch : { cart :  coursesID }} });
            if(course){
                newCartContent = await User.findOneAndUpdate({ carts : { $elemMatch : { cart :  coursesID }} }, 
                    { $set : { "carts.$.quantity" : quantity} }, { new : true }).select('-_id -tokens')
            } else {
                newCartContent =  await User.findByIdAndUpdate(req.user['_id'],  
                { $push : { carts : { cart : coursesID, quantity : quantity}}}, {new : true}).select('-_id -tokens');
            }
            // let Test =  await User.findById('645f9be2028821b4dee537ed').populate({
            //     path : 'carts',
            //     populate : { path : 'cart'},
            // });
            // console.log(Test);
            successHandle(res, newCartContent);
        } catch(err){
            console.log(err);
        }
    },

    //刪除購物車內容
    async deleteCartContent(req, res, next){
        /**
         * #swagger.tags = ['Carts'],
         * #swagger.description = '刪除購物車內容API'
         * #swagger.parameters['coursesID'] = {
                    in: 'path',
                    description: 'Course ID.' 
            }
            #swagger.responses[200] = {
                description: '刪除成功',
                schema : {
                    "status": "success",
                    "data" : [
                        {
                            "cart": {
                            "_id": "id",
                            "user_id": "userId",
                            "title": "course",
                            "category": "courseCategory",
                            "price": "price",
                            "introduction": "Introduction",
                            "is_publish": true,
                            "createdAt": "2023-05-15T02:38:11.526Z",
                            "updatedAt": "2023-05-15T02:38:11.526Z"
                        },
                            "quantity": 10,
                        "_id": "64632f16e398e5e8c3ae97a8"
                        }
                    ]
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            let { coursesID } = req.params;
            if(!ObjectId.isValid(coursesID))
                return next(customiError(400, "購物車無該商品"))
            const findCourse = await Courses.findById(coursesID);
            if(!findCourse)
                return next(customiError(400, "購物車無該商品"))
            let currentCart = await User.find({ carts : { $elemMatch : { cart : coursesID} }});
            if(!currentCart.length)
                return next(customiError(400, "您尚未將該課程加入購物車"));
            let newCartContent =  await User.findOneAndUpdate(
                { carts : { $elemMatch : { cart : coursesID} }},
                { $pull: { carts: { cart: coursesID } } }, 
                { new : true }).select('-_id -tokens');
            let currentCartContent = await User.findById(req.user['_id']);
            successHandle(res, currentCartContent.carts);
        } catch(err){
            console.log(err);
        }
    }
}

module.exports = cartController;