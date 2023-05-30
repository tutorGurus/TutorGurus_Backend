const User = require('../models/userModel');
const jwtFn = require('../middleware/auth');
const customiError = require("../errorHandler/customiError");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const successHandle = require('../service/successHandler');

let commonInstruction = {
    //Google登入
    async googlelogIn(req, res, next){
        try{
        const user = await User.findById(req.user.id);
        jwtFn.jwtGenerating(user, res, next);
        }
        catch(err){
            return next(customiError(400, "登入失敗"))
        }
    },
    //登入
    async logIn(req, res, next){
        /** 
            #swagger.tags = ['Student']
            #swagger.description = '學生登入API'
            #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $email : "Test@gmail.com",
                    $password : "password",
                }
            }
            #swagger.responses[200] = {
                description: '登入成功獲取token',
                schema : {
                    "status": "success",
                    "data": "JWT token"
                }
            }
         */
        try{
            const { email, password} = req.body;
            if(!email || !password){
                return next(customiError(400,"請輸入完整帳號和密碼"));
            }
            const user = await User.findOne({"email" : email}).select("+password");
            console.log(123);
            const auth = await bcrypt.compare(password, user.password);
            if(!auth){
                return next(customiError(400,"無此帳號或密碼錯誤！"));
            }
            jwtFn.jwtGenerating(user, res, next);
        } catch(err){
            if(err.message == "Cannot read properties of null (reading 'password')"){
                return next(customiError(400,"無此帳號或密碼錯誤！"));
            }
            return next(customiError(500, "伺服器錯誤！"));
        }
    },
    //登出
    async logOut(req, res, next){
        /**
         * #swagger.tags = ['Student'],
         * #swagger.description = '登出API'
            #swagger.responses[200] = {
                description: '登出成功',
                schema : {
                    "status": "success"
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            await User.updateOne({"_id" : req.user._id}, { $pull : { tokens : { token : req.token}}},{new : true});
            res.send({stauts : "success"});
        } catch(err){
            return next(customiError(400, err));
        }
    },
    //獲取個人資訊
    async getUserInfo(req, res, next){
        /**
         * #swagger.tags = ['Student'],
         * #swagger.description = '學生取得個人檔案API'
                #swagger.responses[200] = {
                description: '資料取得成功',
                schema : {
                "status": "success",
                "data": {
                        "_id": "6462d56fa8ef5218d79afd79",
                        "name": "Rose",
                        "email": "rose@gmail.com",
                        "password": "$2a$15$8UHRa0FEVu/wNaY/eYKel.hhNF3p1Og0exWIqTS.GRjezRsjUZhOu",
                        "birthday": null,
                        "phone": "",
                        "gender": "",
                        "degree": "",
                        "school": "",
                        "country": "",
                        "profile_image": " ",
                        "bank_account": "",
                        "carts": [],
                        "createdAt": "2023-05-16T00:59:27.783Z",
                        "updatedAt": "2023-05-16T01:01:51.564Z"
                    }
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            res.send({
                status : "success",
                data : req.user
            });
        } catch {
            return next(customiError(400, err));
        }
    }
}


module.exports = commonInstruction;