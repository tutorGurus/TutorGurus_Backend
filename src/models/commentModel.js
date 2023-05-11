const mongoose = require('mongoose');

const commentModel = new mongoose.Schema({
    course_id : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "課程ID為必填"]
    },
    rate : {
        type : Number,
    }, 
    student_comment : String,
    tutor_comment : String,
}, {
    versionKey : false,
    timestamps: true   
})

const Comment = mongoose.model("Comment", commentModel);
module.exports = Comment;