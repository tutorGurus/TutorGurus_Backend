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
    default : ""  
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
    imageName : String,
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

userSchema.statics.findOrCreate = async function (doc) {
    let result = await this.findOne({googleId:doc.googleId});
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
