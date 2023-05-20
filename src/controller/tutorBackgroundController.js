const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const User = require('../models/userModel');
const TutorBackground = require('../models/tutorBackgroundModel');

const tutorBackgroundController = {
    // 取得教師背景資料
    async getAllTutorBackground(req, res, next){
        /**
         * #swagger.tags = ['Teacher'],
         * #swagger.description = '取得全部教師背景資料API'
         */
        const allTutorBackground = await TutorBackground.find().populate({
            path: "tutorId",
            select: "name profile_image"
        });
        successHandle(res, allTutorBackground);
    },
    // 取得單一教師背景資料
    async getTutorBackground(req, res, next){
        /**
         * #swagger.tags = ['Teacher'],
         * #swagger.description = '取得單一教師背景資料API'
            #swagger.responses[200] = {
                description: 'OK',
                schema : {
                    "title": "王牌家教老師",
                    "teaching_category": ["國一國文","國一數學","高一英文"],
                    "introduction": "<p>多年教學經驗，讓我開始思考，為什麼孩子對於數學的認知及學習程度會有落差？</p><p>要如何幫助孩子們不排斥數學、喜歡上數學、甚至愛上數學呢？讓Kiki老師來告訴你！</p>",
                    "educational_background": ["台大數學系", "台大應數所"],
                    "work_experience": ["2013 - 2018 學生一對一家教", "2018 - 2023 私人補習班"],
                    "notice": "用Zoom上課，請提早上線等候！",
                    "teaching_introduction": [
                        {
                            "teaching_category": "國中",
                            "subject" : "數學",
                            "teaching_content": "整數的運算、分數的運算、一元一次方程式、二元一次聯立方程式、直角坐標與二元一次方程式的圖形、比與比例式、一元一次不等式、統計、生活中的幾何"
                        }
                    ],
                    "tutorId": {
                        "_id": "6469029fea027c04ceebc898",
                        "name": "Allen",
                        "profile_image": " ",
                        "carts": []
                    }
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.tutorId;
            const tutorBackground = await TutorBackground.findOne({"tutorId" : id}).populate({
                path: "tutorId",
                select: "name profile_image"
            });
            if(tutorBackground) {
                successHandle(res, tutorBackground);
            } else {
                return next(customiError(400, "無此 ID 帳號資訊！"))
            }
        } catch(err) {
            return next(err);
        }
    },
    // 修改教師背景資料
    async updateTutorBackground(req, res, next){
        /**
         * #swagger.tags = ['Teacher'],
         * #swagger.description = '修改教師背景資料API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $title: "王牌家教老師",
                    $teaching_category: ["國文","數學","英文"],
                    $introduction: "<p>多年教學經驗，讓我開始思考，為什麼孩子對於數學的認知及學習程度會有落差？</p><p>要如何幫助孩子們不排斥數學、喜歡上數學、甚至愛上數學呢？讓Kiki老師來告訴你！</p>",
                    $educational_background: ["台大數學系", "台大應數所"],
                    $work_experience: ["2013 - 2018 學生一對一家教", "2018 - 2023 私人補習班"],
                    $notice: "用Zoom上課，請提早上線等候！",
                    $teaching_introduction: [
                        {
                            $teaching_category: "國中",
                            $subject : "數學",
                            $teaching_content: "整數的運算、分數的運算、一元一次方程式、二元一次聯立方程式、直角坐標與二元一次方程式的圖形、比與比例式、一元一次不等式、統計、生活中的幾何"
                        }
                    ]
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.tutorId;
            const { body } = req;
            const updatedTutorBackground = await TutorBackground.findOneAndUpdate({"tutorId" : id
            }, {
                title: body.title,
                teaching_category: body.teaching_category,
                completed_courses_num: body.completed_courses_num,
                introduction: body.introduction,
                educational_background: body.educational_background,
                work_experience: body.work_experience,
                notice: body.notice,
                teaching_introduction: body.teaching_introduction
            });
            successHandle(res, updatedTutorBackground);
        } catch (err) {
            return next(err);
        }
    }
}

module.exports = tutorBackgroundController;