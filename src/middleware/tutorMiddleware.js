const customiError = require('../errorHandler/customiError');

const tutorMiddleWare = {
    async isTutor(req, res, next){
        if(req.user['role'] != 'T' || req.user['status'] != 'tutor'){
            return next(customiError(400, '請先註冊為教師或等待審核！'))
        }
        next();
    }
}

module.exports = tutorMiddleWare;