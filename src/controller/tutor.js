const User = require('../models/userModel');
const TutorBackground = require('../models/tutorBackgroundModel');
const TutorSchedule = require('../models/tutorScheduleModel');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const tutorIdModel = require('../models/tutorIdModel');
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
            console.log(req.user);
            let { name, email, phone, degree, school, birthday, address, major, teaching_category} = req.body;
            if(!name || !email || !phone || !degree || !school || !birthday || !address || !major || teaching_category.length == 0){
                return next(customiError(400, "請填寫必要欄位"));
            }
            let newTutor = await User.findOneAndUpdate({'_id' : req.user._id}, {
                name :  name,
                // email : email,
                phone : phone,
                gender : gender,
                degree : degree,
                school : school,
                country : country,
                profile_image : profile_image,
                birthday : birthday
            })
            // // 建立關聯資料集 - 教學背景
            // await TutorBackground.create({ tutorId: newUser._id });
            // // 建立關聯資料集 - 行事曆
            // await TutorSchedule.create({ tutorId: newUser._id });
            // successHandle(res, newUser);
            res.send({status : "sucess"})
        } catch(err){
            return next(err);
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
            if(!name){
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
    }
}

module.exports = tutorController;