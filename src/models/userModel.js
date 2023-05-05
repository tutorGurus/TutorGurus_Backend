const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "請輸入姓名"]
    },
    email : {
        type : String,
        required : [true, "請輸入Email"],
        lowercase : true
    },
    password : {
        type : String,
        required : [true, "請填入帳號"],
        select : false
    },
    role : {
        type : String,
        enum : ['S', 'T', 'A'],
        select : false
    },
    status : {
        type : Number,
        default : 0,
    }
},{ versionKey : false});

const User = mongoose.model("User", userSchema);

module.exports = User;
