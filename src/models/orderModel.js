const mongoose = require('mongoose');
const Courses = require('./coursesModel')

const orderSchema = new mongoose.Schema({
    order_date : {
        type : Date,
        require : [true, "訂單日期為必填欄位"]
    },
    quantity : {
        type : Number,
        required : [true, "總購買數為必填"]
    },
    content : [
        {
            payment_Info : {
                type : String
            },
            coupon : {
                type : String
            }    
        }
    ],
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
        type : String,
        default : "訂單完成"
    }
},{ 
    versionKey : false,
    timestamps: true
})


orderSchema.pre(/^find/, function(next){
    this.populate({
        path: "course_id",
    });
    next();
})



const Order = mongoose.model("Oder", orderSchema);
module.exports = Order;

