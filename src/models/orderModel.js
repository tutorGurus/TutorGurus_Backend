const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "訂單名稱為必填選項"]
    },
    content : {
        type : String,
        required : [true, "訂單內容為必填"]
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "訂購人ID為必填"]
    },
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses",
        required : [true, "課程ID為必填"]
    },
    total_price : {
        type : Number,
        required : [true, "課程價格為必填"]
    },
    status : {
        type : String
    }
})

const Order = mongoose.model("Oder", orderSchema);
module.exports = Order;

