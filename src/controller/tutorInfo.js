const User = require('../models/userModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');

let tutorController = {
    async tutorsList(req, res, next){
        try{
            const {tutorID} = req.body;
            if(!tutorID)
                return next(customiError(400, "無教師ID "));
            
            const tutorsList = await User.find({
                role : 'T',
            })
            successHandle(res, tutorsList);
        } catch(err){
            return next(err);
        }
    },

    async tutorDetail(req, res, next){
        try{
            const {tutorID} = req.body;
            if(!tutorID)
                return next(customiError(400, "無教師ID "));
            
            const tutorDetail = await User.find({
                tutorID: tutorID,
            })
            successHandle(res, tutorDetail);
        } catch(err){
            return next(err);
        }
    },
}

module.exports = tutorInfosController;