const mongoose = require('mongoose');

const cartModel = new mongoose.Schema({
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses",
        required : [true, "課程ID為必填"]
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        requird : [true, "請填入購物車所屬人ID"]
    }
    }, {
        versionKey : false,
        timestamps: true
    })

    const Carts = mongoose.model('Carts', cartModel);
    module.exports = Carts;