const mongoose = require('mongoose');
const User = require('./userModel');


const classPriceSchema = new mongoose.Schema({
    user_Id : {
        type : mongoose.Schema.Types.ObjectId,
        require : true
    },
    grade: {
        type : String,
        required : [true , "授課年級為必填欄位"]
    }, 
    category : {
        type : String,
        required : [true, "科別為必填欄位"]
    },
    price : {
        type : String,
        required : [true, "課程價格為必填欄位"]
    }
},{
    versionKey : false
});
const priceSchema = mongoose.model("classPrice", classPriceSchema);
module.exports = priceSchema;