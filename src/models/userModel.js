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
        select : false
    },
    googleId : String,
    token : {
        type : String,
        default : "",
        select : false
    },
    // tokens : [{
    //     token : { type : String},
    // }],
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
    address: "String",
    school : {
        schoolName : {
        type : String,
        default : ""
    },
    major : {
        type : String,
        default : ""
    }
    },
    country : {
        type : String,
        default : ""
    },
    profile_image : {
        type : String,
        default : " "     
    },
    background_image : {
        type : String,
        default : " "     
    },
    bank_account : {
        type : String,
        default : "",
        select : false
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
    tutorBackgroundId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'TutorBackground',
            select: false
    },
    tutorScheduleId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'TutorSchedule',
            select : false
    },
    status : {
        type :String,
        enum : ['cancel','generally', "Apply", "tutor"],
        default : 'generally'
    },
    tutorIdCustom : Number,
    createdAt : {
        type : Date,
        default : Date.now,
        select : false
    },
    updatedAt : {
        type : Date,
        default : Date.now,
        select : false
    }
},{ 
    versionKey : false
});

userSchema.statics.findOrCreate = async function (doc) {
    let result = await this.findOne({googleId : doc.googleId});
    if (result) {
        return result;
    } else {
        result = new this(doc);
        return await result.save();
    }
}

userSchema.pre(/^find/, function(next){
    this.populate({
        path : 'carts',
        populate : { path : 'cart', }
    });
    next();
});


const User = mongoose.model("User", userSchema);
module.exports = User;
