const mongoose = require('mongoose');

const classPriceSchema = new mongoose.Schema({
    user_id : {
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
});
const priceSchema = mongoose.model("classPriceSchema", classPriceSchema);
module.exports = priceSchema;