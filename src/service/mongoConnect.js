const mongoose = require('mongoose');
function connectDB(){
    if(process.env.NODE_ENV.trim() === 'dev'){
        mongoose.connect('mongodb://127.0.0.1:27017/TutorGurus')
        .then(() => {console.log("connet localDB successfully!")}).catch(err => {
            console.log("DB連線失敗");
        })
    } 
    else {
        const url = process.env.MONGODB_CONNECTPATH.replace('<password>', process.env.MONGODB_PASSWORD);
        mongoose.connect(url)
        .then(()=>console.log('connect successfully !')).catch(err => {
            console.log("DB連線失敗");
        })
    }
};
module.exports = connectDB;
