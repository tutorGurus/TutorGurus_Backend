const mongoose = require('mongoose');
const User = require('./userModel');

const courseSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true , "教師ID為必填欄位"]
    },
    education_stages: {
        type : String,
        required : [true , "授課程度為必填欄位"]
    },
    grade: {
        type : String,
        required : [true , "授課年級為必填欄位"]
    },
    semester: {
        type : String,
        required : [true , "學期為必填欄位"]
    },
    category : {
        type : String,
        required : [true, "科別為必填欄位"]
    },
    title : {
        type : String,
        required : [true , "課程名稱為必填欄位"]
    },
    price : {
        type : String,
        required : [true, "課程價格為必填欄位"]
    },
    introduction : {
        type: String
    },
    preparation : [{
        item_title : { type : String},
        content : { type : String }
    }],
    is_publish : {
        type : Boolean,
        default : true
    },
    status: {
        type: String,
        default : ""
    },
    rate : {
        type : Number,
        default : 0
    },
},{
    versionKey : false,
    timestamps: true
})

const Courses = mongoose.model("Courses", courseSchema);
module.exports = Courses;