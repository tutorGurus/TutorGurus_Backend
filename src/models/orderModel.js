const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "訂單名稱為必填選項"]
    }
})

