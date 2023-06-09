const customiError = require('../errorHandler/customiError');

const idMiddleWare = {
    async isTutor(req, res, next){
        if(req.user['role'] != 'T' || req.user['status'] != 'tutor'){
            return next(customiError(400, '請先註冊為教師或等待審核！'))
        }
        next();
    },
    async isAdmin(req, res, next){
        if(req.user['name'] != 'admin' || req.user['role'] != 'A' || req.user['email'] != 'admin'){
            return next(customiError(400, '權限不足'));
        }
        next();
    }
}

module.exports = idMiddleWare;