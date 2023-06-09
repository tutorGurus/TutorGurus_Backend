let User = require('../models/userModel');
let TutorSchedule = require('../models/tutorScheduleModel');
let successHandle = require('../service/successHandler');

let adminController = {
    async getAlltutorInfo(req, res, next){
        try{
            let searchData = await User.find({$or: [{role : 'T'}, { status : 'Apply'}]})
            .populate({path : 'tutorBackgroundId', select : '-_id -tutorId'})
            .populate({path : 'tutorScheduleId', select : '-_id -tutorId'})
            successHandle(res, searchData);
        } catch(err){
            console.log(err);
        }
    },

    async updateTutorIdentity(req, res, next){
        try{
            const { tutorIdCustom } = req.params;
            let newTutor = await User.findOneAndUpdate({
                tutorIdCustom : tutorIdCustom
            },{
                role : 'T',
                status : 'tutor'
            })
            successHandle(res, "修改成功");
        } catch(err){
            console.log(err)
        }
    }
}

module.exports = adminController;