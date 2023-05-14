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
        type : Date,
        default : ""
    },
    phone : {
        type : String,
        default : ""
    },
    gender : {
        type : String,
        default : ""
    },
    degree : {
        type : String,
        default : ""

    },
    school : {
        type : String,
        default : ""
    },
    country : {
        type : String,
        default : ""
    },
    profile_image : {
        type : String,
        default : " "     
    },
    bank_account : {
        type : String,
        default : ""
    },
    carts : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Carts"
    },
    tutorId : {
        type : Number,
        default : " "     
    },
    

},{ 
    versionKey : false,
    timestamps: true
});



const User = mongoose.model("User", userSchema);
module.exports = User;
