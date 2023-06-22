const jwt = require('jsonwebtoken');
const successHandler = require('../service/successHandler');
const customiError = require('../errorHandler/customiError');
const User = require('../models/userModel');

let jwtFn = {
    //生成Token
    async jwtGenerating(userInfo, res, next){
        try{
        //生成JWT
        await User.findByIdAndUpdate(userInfo["_id"], {token : ""}, {new : true});
        let jwtToken = jwt.sign({id : userInfo["_id"].toString()}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_DAYS});

        //單人登入
        await User.findByIdAndUpdate(userInfo["_id"], {token : jwtToken.toString()}, {new : true});
        //多人登入
        // await User.findByIdAndUpdate(userInfo["_id"], { $push : {tokens : { token : jwtToken.toString() } }}, {new : true});

        successHandler(res, jwtToken);
        } catch (error){
            await User.findByIdAndUpdate(userInfo["_id"], {token : ""}, {new : true});
            return next(error)
        }
    },
    //驗證Token
    async isAuth(req, res, next){
        try {
            let token;
            //驗證是否夾帶token
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                token = req.headers.authorization.split(' ')[1];
            };
            if(!token && req.originalUrl == '/tutors/v1/register'){
                return next(customiError(400, "請先註冊加入我們"));
            };
            if(!token){
                console.log(37);
                return next(customiError(400, "請先登入"));
            };
            const decryptPayload  = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                    if(err){
                        reject(err);
                    } else {
                        resolve(payload);
                    }
                })
            });
            //多人登入
            // const user = await User.findOne({ "_id" : decryptPayload.id , 'tokens.token' : token });
             //單人登入
            const user = await User.findOne({ "_id" : decryptPayload.id}).select("token");
            if(!user){
                console.log(53)
                return next(customiError(400, "請先登入"));
            }
            if(!user.token || user.token != token){
                console.log(57);
                return next(customiError(400, "請先登入"));
            }
            const currentUser = await User.findById(decryptPayload.id).select('-token +role -createdAt -updatedAt -password');
            req.user = currentUser;
            req.token = token;
            next();
        } catch (err){
            console.error("auth.js (63)", err.message);
            if(err.message == "invalid token" || err.message == "jwt expired"  ||  err.message == "invalid signature"){
                return next(customiError(400, "無效Token請先登入"))
            }

            return next(customiError(500, "請聯絡客服"));
        }
    }
}

module.exports = jwtFn;