const jwt = require('jsonwebtoken');
const successHandler = require('../service/successHandler');
const costomiError = require('../errorHandler/customiError');
const User = require('../models/userModel');

let jwtFn = {
    //生成Token
    async jwtGenerating(userInfo, res, next){
        try{
        //生成JWT
        let jwtToken = jwt.sign({id : userInfo["_id"].toString()}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_DAYS});
        await User.findByIdAndUpdate(userInfo["_id"], { $push : {tokens : { token : jwtToken.toString() } }}, {new : true});
        successHandler(res, jwtToken);
        } catch (error){
            return next(error)
        }
    },
    //驗證Token
    async isAuth(req, res, next){
        try {
            let token;
            //驗證是否夾帶token
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
                token = req.headers.authorization.split(' ')[1];
            if(!token)
                return next(costomiError(400, "請先登入"));
            const decryptPayload  = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                    if(err){ 
                        reject(err);
                    } else {
                        resolve(payload);
                    }
                })
            })
            const user = await User.findOne({ "_id" : decryptPayload.id , 'tokens.token' : token });
            if(!user)
                return next(costomiError(400, "請先登入"));
            const currentUser = await User.findById(decryptPayload.id).select('+password -tokens');
            req.user = currentUser;
            req.token = token;
            next();
        } catch (err){
            console.error("auth.js (44)", err.message);
            if(err.message == "invalid token" || err.message == "jwt expired"){
                return next(costomiError(400, "請先登入"))
            }
            return next(costomiError(500, "請聯絡客服"));
        }
    }
}

module.exports = jwtFn;