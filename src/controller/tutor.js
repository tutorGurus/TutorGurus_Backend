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
            if(req.user['role'] == 'T'){
                return next(customiError(400, "已是教師身份!"));
            }
            let { userName, gender, phone, address, birthday, degree, school, teaching_category, country} = req.body;
            if(!userName || !gender || !phone || !address || !birthday || !degree || !school['schoolName'] || !school['major'] || teaching_category.length == 0){
                return next(customiError(400, "請填寫必要欄位"));
            }
            let tutorId = await tutorIdModel.find();
            if(tutorId.length == 0){
                tutorId = await tutorIdModel.create({},{new:true});
            };
            let newTutorId = tutorId[0]['serial_number'] += 1;
            await tutorIdModel.findByIdAndUpdate(tutorId[0]['_id'], {serial_number : newTutorId});
            let newTutor = await User.findOneAndUpdate({'_id' : req.user._id}, {
                name :  userName,
                // email : email,
                gender : gender,
                phone : phone,
                address : address,
                birthday : birthday,
                degree : degree,
                school : school,
                country : country,
                role : 'T',
                tutorId : newTutorId
                
            }, {new : true}).select('-token -createdAt -updatedAt');
            // 建立關聯資料集 - 教學背景
            await TutorBackground.create({ tutorId: newTutor._id , teaching_category : teaching_category});
            // 建立關聯資料集 - 行事曆
            await TutorSchedule.create({ tutorId: newTutor._id });
            successHandle(res, newTutor);
        } catch(err){
            return next(err);
        }
    }
}

module.exports = tutorController;