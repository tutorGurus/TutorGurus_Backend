const mongoose = require("mongoose");

const tutorBackgroundSchema = new mongoose.Schema({
    tutorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    tutorIdCustom : Number,
    title : {
        type : String,
        maxlength : 50,
        default: ""
    },
    teaching_category : {
        type : [String],
        default : []
    },
    completed_courses_nun : {
        type : Number,
        default : 0
    },
    introduction : {
        type : String,
        default : ""
    },
    educational_background : {
        type : String,
        default : ""
    },
    work_experience : {
        type : String,
        default : ""
    },
    teaching_introduction : [{
        teaching_level : {
            type : String,
            default : ""
        },
        subject : {
            type : String,
            default : ""
        },
        teaching_content : {
            type : String,
            default : ""
        }
    }],
    notice : {
        type : String,
        default : ""
    }
},{
    versionKey : false
});

const TutorBackground = mongoose.model("TutorBackground", tutorBackgroundSchema);
module.exports = TutorBackground;