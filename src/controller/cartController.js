const Courses = require('../models/coursesModel');
const User = require('../models/userModel');
const successHandle = require('../service/successHandler');
const customiError = require('../errorHandler/customiError');

let cartController = {


    async getCartContent(req, res, next){
        let cartList = req.user.carts;
        successHandle(res,cartList);
    },


    async addCartContent(req, res, next){
        try{
            let { coursesID } = req.params;
            let { quantity } = req.query;
            if(!quantity){
                next(customiError(400, "請填入購買數量"));
            }
            let newCartContent
            let course = await User.findOne({ carts : { $elemMatch : { cart :  coursesID }} });
            if(course){
                newCartContent = await User.findOneAndUpdate({ carts : { $elemMatch : { cart :  coursesID }} }, 
                    { $set : { "carts.$.quantity" : quantity} }, { new : true })
            } else {
                newCartContent =  await User.findByIdAndUpdate(req.user['_id'],  
                { $push : { carts : { cart : coursesID, quantity : quantity}}}, {new : true});
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

    async deleteCartContent(req, res, next){
        try{
            let { coursesID } = req.params;
            let newCartContent =  await User.findOneAndUpdate(
                { carts : { $elemMatch : { cart : coursesID} }},
                { $pull: { carts: { cart: coursesID } } }, 
                {new : true });
            successHandle(res, newCartContent);
        } catch(err){
            console.log(err);
        }
    }
}

module.exports = cartController;