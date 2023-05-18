const User = require('../models/userModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');

let tutorInfosController = {
    // 教師一覽
    async tutorsList(req, res, next){
        try{
            const tutorsList = await User.find({
                role : 'T',
            }).select('-tokens')
            successHandle(res, tutorsList);
        } catch(err){
            return next(err);
        }
    },
    // 教師詳情
    async tutorDetail(req, res, next){
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