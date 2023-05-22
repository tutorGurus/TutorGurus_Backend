const multer = require('multer');
const path = require('path');
const customiError = require('../errorHandler/customiError');

const upload = multer({
    limits :{
        fileSize : 2*1024*1024,
    },
    fileFilter(req, file, cb){
        //path.extname()，path 的最后一部分中從最后一次出现的 .（句點）字符到字符串的结尾
        const ext = path.extname(file.originalname).toLowerCase();
        if(ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg'){
            cb(new Error("檔案格式錯誤，限定為jpg、png、jpeg"));
        }
        cb(null, true);
        //cb為一個callback，當沒有錯誤時第一個參數戴上null，並且第二個設成true
    }
}).any();
//any()等同於req.Info,可將
module.exports = upload;