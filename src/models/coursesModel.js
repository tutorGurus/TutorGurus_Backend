const mongoose = require('mongoose');
const User = require('./userModel');

const courseSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true , "教師ID為必填欄位"]
    },
    title : {
        type : String,
        required : [true , "課程名稱為必填欄位"]
    },
    category : {
        type : String,
        required : [true, "科別為必填欄位"]
    },
    price : {
        type : String,
        required : [true, "課程價格為必填欄位"]
    },
    introduction : String,
    is_publish : {
        type : Boolean,
        default : false
    }
},{
    versionKey : false,
    timestamps: true
})