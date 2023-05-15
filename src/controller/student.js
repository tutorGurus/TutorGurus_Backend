const User = require('../models/userModel');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const jwtFn = require('../middleware/auth');

const regex = /^(?=.*[a-z])(?=.*[A-Z])/; //密碼必須包含一個大小以及一個小寫

let userController = {
    async studentSignUp(req, res, next){
    
    /**
        * #swagger.tags = ['Student']
        * #swagger.description = '學生註冊API'
        * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $name : 'Avocado',
                    $email : "Avocado@gmail.com",
                    $userPassword : "Aa1234567",
                    $confirmPassword : "Aa1234567"
                }
            }
        * #swagger.responses[200] = {
                description: '註冊成功',
                schema : {
                    "status": "success",
                    "data": {
                        "name": "Test",
                        "email": "test@gmail.com",
                        "password": "$2a$15$si.F.6x1GJk6VwKQWUkmu.LCd/Gif8PTz3ExAGyhE8s8l/UHfOQFq",
                        "role": "S",
                        "status": 0,
                        "_id": "6455d6e919231164a788881"
                    }
                }
            }
     */

        try{
            console.log(req.body);
            let {userName, email, userPassword, confirmPassword} = req.body;
            let emailCheck = await User.findOne({"email" : email});
            console.log(emailCheck);
            if(emailCheck)
                return next(customiError(400, "該信箱已被註冊"));
            if(!userName || !email || !userPassword || !confirmPassword)
                return next(customiError(400, "欄位未填寫完整"));
            if(!validator.isEmail(email))
                return  next(customiError(400, "信箱格式錯誤"));
            if(!regex.test(userPassword))
                return next(customiError(400, "密碼格式不正確 : 至少包含一個大寫與一個小寫"));
            if(!validator.isLength(userPassword, { min : 8 }))
                return next(customiError(400, "密碼格式不正確 : 至少為8碼"));
            if(userPassword != confirmPassword)
                return next(customiError(400, "密碼不一致"));
            
            let salt = bcrypt.genSaltSync(15);
            let secretPassword = bcrypt.hashSync(userPassword, salt);
            let newUser = await User.create({
                name : userName,
                email : email,
                password : secretPassword,
                role : 'S',
            })
            successHandle(res, newUser);
        } catch(error) {
            return next(error)
        }
    },

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

    async editInfo(req, res, next){
        /**
         * #swagger.tags = ['Student'],
         * #swagger.description = '學生編輯個人檔案API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $name : "userName",
                    $email : "Test@gmail.com",
                }
            }
            #swagger.responses[200] = {
                description: '資料修改成功',
                schema : {
                    "status": "success",
                    "data": {
                        "_id": "userID",
                        "name": "newName",
                        "email": "newMail@gmail.com",
                    }
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            let { name, email } = req.body;
            if(!name || !email ){
                return next(customiError(400, "必填欄位不得為空"));
            }
            
            if(email.toLowerCase() !== req.user.email){
                let emailCheck = await User.findOne({"email" : email})
                if(emailCheck)
                    return next(customiError(400, "該信箱已被註冊"));
            }
            if(!validator.isEmail(email)){
                return next(customiError(400, "信箱格式錯誤"));
            }
            console.log(await User.findOne({"_id" : req.user._id}))
            let replaceData = await User.findOneAndUpdate( {"_id" : req.user._id}, {
                $set : {
                    name :  name,
                    email : email,
                }
            },{ new : true }).select('-tokens');
            successHandle(res, replaceData);
        } catch(err) {
            return next(customiError(400, err));
        }
    },

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
            console.log(req.user)
            await User.updateOne({"_id" : req.user._id}, { $pull : { tokens : { token : req.token}}},{new : true});
            res.send({stauts : "success"});
        } catch(err){
            return next(customiError(400, err));
        }
    },

    async getUserInfo(req, res, next){
        try{
            res.send({
                status : "success",
                data : req.user});
        } catch {
            return next(customiError(400, err));
        }
    }
}


module.exports = userController;