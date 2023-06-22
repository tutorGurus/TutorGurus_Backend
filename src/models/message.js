const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: {
        type : String,
        require : [true, "訊息內容需填寫"]
    },
    user: {
        type: String,
    },
    chatroom: {
        type:  String,
    },
    createAt: {
        type: Number,
        select: false
    },
    updatedAt: {
        type: Number,
        select: false
    },
}, { versionKey: false,
    // 自動添加 createdAt, updatedAt
    timestamps: {
        currentTime: () => Date.now(),
    },
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;