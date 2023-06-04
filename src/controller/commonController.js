const User = require('../models/userModel');
const jwtFn = require('../middleware/auth');
const customiError = require("../errorHandler/customiError");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const successHandle = require('../service/successHandler');
const tutorBackground = require('../models/tutorBackgroundModel');
const regex = /^(?=.*[a-z])(?=.*[A-Z])/; //密碼必須包含一個大小以及一個小寫

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
    //一般註冊
    async signUp(req, res, next){
        /**
        * #swagger.tags = ['共同行為']
        * #swagger.description = '一搬註冊API（老師學生）'
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
                        "name": "avocado",
                        "email": "avocado@gmail.com",
                        "password": "$2a$08$pEi4sTWQ8NrnHRIJrEWkXeWqu/X5LzSky/dlySX1JOFXD93k7TNSC",
                        "token": "",
                        "role": "S",
                        "birthday": " ",
                        "phone": "",
                        "gender": "",
                        "degree": "",
                        "school": {
                            "schoolName": "",
                            "major": ""
                        },
                        "country": "",
                        "profile_image": " ",
                        "bank_account": "",
                        "_id": "6478c115a1efd5a4f934570d",
                        "carts": [],
                        "createdAt": "2023-06-01T16:02:29.036Z",
                        "updatedAt": "2023-06-01T16:02:29.036Z"
                    }
                }
            }
     */

        try{
            let {name, email, password, confirmPassword} = req.body;
            let emailCheck = await User.findOne({"email" : email})
            if(emailCheck)
                return next(customiError(400, "該信箱已被註冊"));
            if(!name || !email || !password || !confirmPassword)
                return next(customiError(400, "欄位未填寫完整"));
            if(!validator.isEmail(email,{host_whitelist:['gmail.com', 'yahoo.com']})){
                return  next(customiError(400, "信箱格式錯誤"));}
            if(!regex.test(password))
                return next(customiError(400, "密碼格式不正確 : 至少包含一個大寫與一個小寫"));
            if(!validator.isLength(password, { min : 8 }))
                return next(customiError(400, "密碼格式不正確 : 至少為8碼"));
            if(password != confirmPassword)
                return next(customiError(400, "密碼不一致"));
            
            let salt = bcrypt.genSaltSync(8);
            let secretPassword = bcrypt.hashSync(password, salt);
            let newUser = await User.create({
                name : name,
                email : email,
                password : secretPassword,
                role : 'S'
            })
            successHandle(res, newUser);
        } catch(error) {
            return next(error)
        }
    },
    //登入
    async logIn(req, res, next){
        /** 
            #swagger.tags = ['共同行為']
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
            if(user['password'] == undefined){
                return next(customiError(400, "無此帳號"));
            }
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
         * #swagger.tags = ['共同行為'],
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
                //多人登入
                // await User.updateOne({"_id" : req.user._id}, { $pull : { tokens : { token : req.token}}},{new : true});
                //單人登入
                await User.updateOne({"_id" : req.user._id},{token : ""});
                res.send({stauts : "success"});
            } catch(err){
                return next(customiError(400, err));
            }
    },
    //獲取個人資訊
    async getUserInfo(req, res, next){
        /**
         * #swagger.tags = ['共同行為'],
         * #swagger.description = '取得個人檔案API'
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
                        "updatedAt": "2023-05-16T01:01:51.564Z",
                        "teaching_category": []
                    }
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            const user = JSON.parse(JSON.stringify(req.user)); 
            if(req.user['role'] == 'T'){
                const teacherInfo = await tutorBackground.find({ tutorId : req.user['_id']})
                .select('teaching_category -_id');
                user.teaching_category = teacherInfo[0]['teaching_category'];
                successHandle(res, user)
                
            }else {
                successHandle(res, req.user)
            }
        } catch(err) {
            return next(customiError(400, err));
        }
    },
    //修改個人資訊
    async editUserInfo(req, res, next){
        /**
         * #swagger.tags = ['共同行為'],
         * #swagger.description = '修改個人資訊'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                        $userName : "userName",
                        $phone : "09123456789",
                        $gender : "male",
                        $degree : "碩士",
                        $school : {"schoolName": "NCCU","major": "CS" },
                        $country : "Taipei",
                        $profile_image : "https://image",
                        $birthday : "2023-05-16"
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
            if(req.user['role'] == 'T'){
                let {name, gender, phone, address, birthday, degree, school,  country, profile_image} = req.body;
                if(!name || !gender || !phone || !address || !birthday || !degree || !school['schoolName'] || 
                !school['major'] || !country){
                    return next( customiError(400, "必要欄位不得為空"));
                }
                let replaceData = await User.findOneAndUpdate( {"_id" : req.user._id}, {
                    name :  name,
                    // email : email,
                    phone : phone,
                    gender : gender,
                    degree : degree,
                    school : school,
                    country : country,
                    profile_image : profile_image,
                    birthday : birthday,
                    address : address
                },{ new : true }).select('-token -_id -createdAt -updatedAt');
                successHandle(res, replaceData);
            } else {
                let {name} = req.body;
                if(!name){
                    return next(customiError(400, "必填欄位不得為空"));
                }
                let replaceData = await User.findOneAndUpdate( {"_id" : req.user._id}, {
                    name :  name,
                    // email : email,
                    phone : req['body']['phone'],
                    gender : req['body']['gender'],
                    degree : req['body']['degree'],
                    school : req['body']['school'],
                    country : req['body']['country'],
                    major : req['body']['major'],
                    profile_image : req['body']['profile_image'],
                    birthday : req['body']['birthday'],
                    address : req['body']['address']
            },{ new : true }).select('-token -_id');
            successHandle(res, replaceData);
            }
        }catch(err){
            return next(customiError(400, err))
        }
    }
}


module.exports = commonInstruction;