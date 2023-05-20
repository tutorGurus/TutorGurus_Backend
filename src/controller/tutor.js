const User = require('../models/userModel');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const jwtFn = require('../middleware/auth');
const regex = /^(?=.*[a-z])(?=.*[A-Z])/; //密碼必須包含一個大小以及一個小寫

let tutorController = {
    //老師註冊
    async teacherSignUp(req, res, next){
        /**
        * #swagger.tags = ['Teacher']
        * #swagger.description = '教師註冊API'
        * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $userName : 'Avocado',
                    $email : "Avocado@gmail.com",
                    $password : "Aa1234567",
                    $confirmPassword : "Aa1234567"
                }
            }
        * #swagger.responses[200] = {
                description: '註冊成功',
                schema : {
                    "status": "success",
                    "data": {
                        "name": "userName",
                        "email": "userEmail",
                        "password": "secretPassword",
                        "role": "T",
                        "birthday": "xxxx-xx-xx",
                        "phone": "userPhone",
                        "gender": "gender",
                        "degree": "degree",
                        "school": "school",
                        "country": "counrty",
                        "profile_image": "https://profile ",
                        "bank_account": "",
                        "tutorId": "titorId",
                        "_id": "6462d932383dc3473f1b67f4",
                        "tokens": [],
                        "carts": [],
                        "createdAt": "2023-05-16T01:15:30.737Z",
                        "updatedAt": "2023-05-16T01:15:30.737Z"
                    }
                }
            }
     */

        try{
            let {userName, email, password, confirmPassword} = req.body;
            let emailCheck = await User.findOne({"email" : email})
            if(emailCheck)
                return next(customiError(400, "該信箱已被註冊"));
            if(!userName || !email || !password || !confirmPassword)
                return next(customiError(400, "欄位未填寫完整"));
            if(!validator.isEmail(email))
                return  next(customiError(400, "信箱格式錯誤",{domain_specific_validation:true,host_whitelist:['gmail.com', 'yahoo.com']}));
            if(!regex.test(password))
                return next(customiError(400, "密碼格式不正確 : 至少包含一個大寫與一個小寫"));
            if(!validator.isLength(password, { min : 8 }))
                return next(customiError(400, "密碼格式不正確 : 至少為8碼"));
            if(password != confirmPassword)
                return next(customiError(400, "密碼不一致"));
            
            let salt = bcrypt.genSaltSync(15);
            let secretPassword = bcrypt.hashSync(password, salt);
            const tutorsList = await User.find({ role : 'T'});
            let nextTutorNum = tutorsList.length + 1;          
            let newUser = await User.create({
                name : userName,
                email : email,
                password : secretPassword,
                role : 'T',
                tutorId : nextTutorNum
            })
            successHandle(res, newUser);
        } catch(err){
            return next(err);
        }
    },
    //登入
    async logIn(req, res, next){
        /** 
            #swagger.tags = ['Teacher']
            #swagger.description = '教師登入API'
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
        try {
            const { email, password} = req.body;
            if(!email || !password){
                return next(customiError(400,"無此帳號或密碼"));
            }
            const user = await User.findOne({"email" : email}).select("+password");
            if(!user)
                return next(customiError(400, "無此帳號或密碼輸入錯誤"));
            const auth = await bcrypt.compare(password, user.password);
            if(!auth)
                return next(customiError(400,"密碼錯誤！"));
            await User.findByIdAndUpdate(user["_id"],{status : 1});
            jwtFn.jwtGenerating(user, res);
        } catch(error){
            return next(error)
        }
    }, 
    //登出
    async logOut(req, res, next){
        /**
         * #swagger.tags = ['Teacher'],
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
    //修改個人資料
    async editInfo(req, res, next){
        /**
         * #swagger.tags = ['Teacher'],
         * #swagger.description = '老師編輯個人檔案API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $name : "userName",
                    $email : "Test@gmail.com",
                    $phone : "phone",
                    $gender : "gender",
                    $degree : "degree",
                    $school : "school",
                    $country : "country",
                    $profile_image : "profile_image",
                    $birthday : "2023-01-01"
                }
            }
            #swagger.responses[200] = {
                description: '資料修改成功',
                schema : {
                    "status": "success",
                    "data": {
                        "_id": "userID",
                        "name" : "userName",
                        "email" : "Test@gmail.com",
                        "phone" : "phone",
                        "gender" : "gender",
                        "degree" : "degree",
                        "school" : "school",
                        "country" : "country",
                        "tutorId": "tutorId",
                        "profile_image" : "profile_image",
                        "birthday" : "2023-01-01"
                    }
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            let { name, email, phone, gender, degree, school, country, profile_image, birthday } = req.body;
            if(!name || !email ){
                return next(customiError(400, "必填欄位不得為空"));
            }
            // if(email !== req.user.email){
            //     let emailCheck = await User.findOne({"email" : email})
            //     if(emailCheck)
            //         return next(customiError(400, "該信箱已被註冊"));
            // }
            // if(!validator.isEmail(email)){
            //     return next(customiError(400, "信箱格式錯誤"));
            // }
            let replaceData = await User.findOneAndUpdate( {"_id" : req.user._id}, {
                    name :  name,
                    // email : email,
                    phone : phone,
                    gender : gender,
                    degree : degree,
                    school : school,
                    country : country,
                    profile_image : profile_image,
                    birthday : birthday
            },{ new : true }).select('-tokens -_id');
            successHandle(res, replaceData);
        } catch(err) {
            return next(customiError(400, err));
        }
    },
    //獲得個人資訊
    async getUserInfo(req, res, next){
        /**
         * #swagger.tags = ['Teacher'],
         * #swagger.description = '教師取得個人檔案API'
                #swagger.responses[200] = {
                description: '資料取得成功',
                schema : {
                "status": "success",
                "data": {
                        "_id": "id",
                        "name": "userName",
                        "email": "userEmail",
                        "password": "secretPassword",
                        "birthday": "xxxx-xx-xx",
                        "phone": "phoneNum",
                        "gender": "userGender",
                        "degree": "userDegree",
                        "school": "userSchool",
                        "country": "country",
                        "tutorId": "tutorId",
                        "profile_image": "https://profile",
                        "bank_account": "",
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

module.exports = tutorController;