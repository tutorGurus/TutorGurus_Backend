const mongoose = require('mongoose');

const bookingModel = mongoose.Schema({
    booking_user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "課程預約者ID為必填欄位"]
    },
    booked_user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "開課者ID為必填欄位"]
    },
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses",
        required : [true, "課程ID為必填"]
    },
    status : {
        type : Number
    },
    room_link : {
        type : String,
        required : [true, "課堂連結為必填"]
    },
    startTime : {
        type : Date,
        required : [true, "請輸入課程開始時間"]
    },
    endTime : {
        type : Date,
        require : [ture, "請輸入課程結束時間"]
    }
}, {
    versionKey : false,
    timestamps: true
})