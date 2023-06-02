const mongoose = require('mongoose');

const userIdScheme = new mongoose.Schema({
    serial_number : {
        type : Number,
        default : 0
    }
});

const tutorIdModel = mongoose.model("tutorIdRecord", userIdScheme);
module.exports = tutorIdModel;

