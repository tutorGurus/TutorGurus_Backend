const User = require('../models/userModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const TutorBackground = require('../models/tutorBackgroundModel');
const path = require('path');
let tutorInfosController = {
    // 教師一覽
    async tutorsList(req, res, next){
    /**
        * #swagger.tags = ['Teacher']
        * #swagger.description = '教師一覽API'
            #swagger.parameters['teaching_level'] = {
                in : 'query',
                description : '課程授課對象年紀(例如：國一)',
            }
            #swagger.parameters['teaching_category'] = {
                in : 'query',
                description : '學科類別(例如：國文)',
            }
        * #swagger.responses[200] = {

                description: '獲取成功',
                schema : {
                    "status": "success",
                    "data": [ {
                        "_id": "64657e1c72da4bbea188afdf",
                        "name": "avocado",
                        "email": "avocado@gmail.com",
                        "birthday": "birthday",
                        "phone": "phone",
                        "gender": "male",
                        "degree": "碩士",
                        "school": "NCCU",
                        "country": "Taipei",
                        "profile_image": "https://image",
                        "bank_account": "",
                        "tutorId": 1,
                        "carts": [],
                        "createdAt": "2023-05-18T01:23:40.548Z",
                        "updatedAt": "2023-05-18T01:25:14.464Z"
                    }]
                }
            }
     */
    try {
        let teaching_category =
        req.query["teaching_category"] != undefined
            ? req.query["teaching_category"]
            : 0;
        let teaching_level =
        req.query["teaching_level"] != undefined
            ? req.query["teaching_level"]
            : 0;
        // let otherCondition = req.query["teaching_category"] != undefined ? new RegExp(req.query["teaching_category"]) : 0;
        let tutorsList;
        if (!teaching_category && !teaching_level) {
        tutorsList = await TutorBackground.find({ role: "T" });
        } else {
        tutorsList = await TutorBackground.find({
            $or: [
                { teaching_category: { $in: [teaching_category] } },
                {
                    teaching_introduction: {
                    $elemMatch: {
                        teaching_level: teaching_level,
                    },
                    },
                },
            ],
        }).populate({
            path: "tutorId",
            select : "name gender school -_id -carts"
        });
        }
        console.log(tutorsList);
        successHandle(res, tutorsList);
    } catch (err) {
        return next(err);
    }
    },
    // 教師詳情
    async tutorDetail(req, res, next){
        /**
        * #swagger.tags = ['Teacher']
        * #swagger.description = '獲取師資詳情API'
        * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $tutorID : 'tutorID',
                }
            }
        * #swagger.responses[200] = {
                description: '註冊成功',
                schema : {
                    "status": "success",
                    "data": [ {
                        "_id": "64657e1c72da4bbea188afdf",
                        "name": "avocado",
                        "email": "avocado@gmail.com",
                        "birthday": "birthday",
                        "phone": "phone",
                        "gender": "male",
                        "degree": "碩士",
                        "school": "NCCU",
                        "country": "Taipei",
                        "profile_image": "https://image",
                        "bank_account": "",
                        "tutorId": 1,
                        "carts": [],
                        "createdAt": "2023-05-18T01:23:40.548Z",
                        "updatedAt": "2023-05-18T01:25:14.464Z"
                    }]
                }
            }
     */

        try{
            const { tutorID } = req.body;
            if(!tutorID)
                return next(customiError(400, "無教師ID "));
            const tutorDetail = await User.find({
                tutorId: tutorID,
            }).select('-tokens')
            successHandle(res, tutorDetail);
        } catch(err){
            return next(err);
        }
    },
}

module.exports = tutorInfosController;