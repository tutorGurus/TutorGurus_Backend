let User = require('../models/userModel');

let adminController = {
    async getAlltutorInfo(req, res, next){
        try{
            let searchData = await User.find({$or: [{role : 'T'}, { status : 'Apply'}]})
            .populate({
                path : "tutorIdCustom",
                select : 'tutorIdCustom'
            })
            res.send({
                status : "success"
            })
        } catch (err){
            console.log(err)
        }
    }
}

module.exports = adminController;