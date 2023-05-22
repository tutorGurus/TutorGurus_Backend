const User = require('../models/userModel');
const jwtFn = require('../middleware/auth');
const customiError = require("../errorHandler/customiError");

let commonInstruction = {
    async googlelogIn(req, res, next){
        try{
        const user = await User.findById(req.user.id);
        jwtFn.jwtGenerating(user, res, next);
        }
        catch(err){
            return next(customiError(400, "登入失敗"))
        }
    }
}


module.exports = commonInstruction;