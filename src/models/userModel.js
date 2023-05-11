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
    tokens : [{
        token : { type : String},
    }],
    role : {
        type : String,
        enum : ['S', 'T', 'A'],
        select : false
    },
    birthday : {
        type : Date
    },
    phone : {
        type : String
    },
    gender : {
        type : String,
    },
    degree : {
        type : String,
    },
    school : {
        type : String,
    },
    country : {
        type : String
    },
    profile_image : {
        type : String
    },
    bank_account : {
        type : String
    },
    carts : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Carts"
    }

},{ 
    versionKey : false,
    timestamps: true
});



const User = mongoose.model("User", userSchema);
module.exports = User;
