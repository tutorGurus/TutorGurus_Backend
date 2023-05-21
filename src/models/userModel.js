const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "請輸入姓名"]
    },
    email : {
        type : String,
        required : [true, "請輸入Email"]
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
        type : String,
        default : " "
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
    carts : [{
        cart : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Courses"
            },
        quantity : {
                type : Number,
                required : [true, "數量為必填"],
                default : 1
            }
        }],
    tutorId: {
        type : Number,
    },       
},{ 
    versionKey : false,
    timestamps: true
});

userSchema.pre(/^find/, function(next){
    this.populate({
        path : 'carts',
        populate : { path : 'cart', }
    });
    next();
});


const User = mongoose.model("User", userSchema);
module.exports = User;
