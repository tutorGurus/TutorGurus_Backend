const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const User = require('../models/userModel');
const TutorBackground = require('../models/tutorBackgroundModel');

const tutorBackgroundController = {
    // 取得教師背景資料
    async getAllTutorBackground(req, res, next){
        const allTutorBackground = await TutorBackground.find();
        successHandle(res, allTutorBackground);
    },
    // 取得單一教師背景資料
    // async getTutorBackground(res, res, next){
    //     const tutorBackground = await TutorBackground.findOne({"tutorId" : id})
    // },
    // 修改教師背景資料
    async updateTutorBackground(req, res, next){
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

        }
    }
}

module.exports = tutorBackgroundController;