let User = require('../models/userModel');
let TutorSchedule = require('../models/tutorScheduleModel');
let successHandle = require('../service/successHandler');

let adminController = {
    //會取所有老師資訊列表
    async getAlltutorInfo(req, res, next){
        /**
         * #swagger.tags = ['admin'],
         * #swagger.description = '取得所有老師列表'
            #swagger.responses[200] = {
                description: '資料取得成功',
                schema : {
                "status": "success",
                "data": [
                    {
            "school": {
                "schoolName": "NCCU",
                "major": "CS"
            },
            "_id": "6482ad57777782004e4c5550",
            "name": "avocado",
            "email": "avocado@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODJhZDU3Nzc3NzgyMDA0ZTRjNTU1MCIsImlhdCI6MTY4NjMxNTU0MSwiZXhwIjoxNjg2OTIwMzQxfQ.ot9PlPTjZG9xLRMiEJJK5n-9-GBkEUKOvAyTKDKTKAY",
            "birthday": "123456",
            "phone": "09191234567",
            "gender": "male",
            "degree": "university",
            "country": "Taipai",
            "profile_image": " ",
            "status": "Apply",
            "carts": [],
            "createdAt": "2023-06-09T04:40:55.614Z",
            "updatedAt": "2023-06-09T12:59:01.306Z",
            "address": "sample address",
            "tutorBackgroundId": {
                "tutorIdCustom": 1,
                "title": "",
                "teaching_category": [
                    "123",
                    "apple"
                ],
                "completed_courses_nun": 0,
                "introduction": "",
                "educational_background": [],
                "work_experience": [],
                "notice": "",
                "teaching_introduction": []
            },
            "tutorIdCustom": 1,
            "tutorScheduleId": {
                "dates": []
            }
        }
                ]
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            let searchData = await User.find({$or: [{role : 'T'}, { status : 'Apply'}]})
            .populate({path : 'tutorBackgroundId', select : '-_id -tutorId'})
            .populate({path : 'tutorScheduleId', select : '-_id -tutorId'})
            successHandle(res, searchData);
        } catch(err){
            console.log(err);
        }
    },
    //更新帳號狀態(同意教師申請．拒絕申請，註銷帳號)
    async updateTutorIdentity(req, res, next){
        /**
         * #swagger.tags = ['admin'],
         * #swagger.description = '修改身份(教師申請成功、註銷、拒絕教師申請)'
            * #swagger.parameters['tutorIdCustom'] = {
                    in: 'path',
                    description: '流水號ID' 
            }
            #swagger.parameters['status'] = {
                in : 'query',
                description : '狀態',
                required : true
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
            const { status } = req.query;
            const { tutorIdCustom } = req.params;
            let newTutor = await User.findOneAndUpdate({
                tutorIdCustom : tutorIdCustom
            },{
                role : 'T',
                status : status
            })
            successHandle(res, "修改成功");
        } catch(err){
            console.log(err)
        }
    }
}

module.exports = adminController;