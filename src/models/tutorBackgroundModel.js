const mongoose = require("mongoose");

const tutorBackgroundSchema = new mongoose.Schema({
    tutorId : mongoose.Schema.Types.ObjectId,
    title : {
        type : String,
        maxlength : 20,
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
        type : [String],
        default : []
    },
    work_experience : {
        type : [String],
        default : []
    },
    teaching_introduction : [{
        teaching_category : {
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
});

const TutorBackground = mongoose.model("TutorBackground", tutorBackgroundSchema);
module.exports = TutorBackground;