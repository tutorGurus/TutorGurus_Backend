const sizeOf = require('image-size');
const customiError = require('../errorHandler/customiError');
const { v4 : uuidv4 } = require('uuid');
const firebaseAdmin = require('../service/firebase');
const bucket = firebaseAdmin.storage().bucket();
const successHandle = require('../service/successHandler');
const User = require('../models/userModel');




const imageController = {
    
    //上傳頭貼圖片
    async uploadHeadImage(req, res, next){
        /**
         * #swagger.tags = ['ImageProcess'],
         * #swagger.description = '使用者頭貼上傳'
         * #swagger.consumes = ['multipart/form-data']  
            #swagger.parameters['singleFile'] = {
                in: 'formData',
                type: 'file',
                required: 'true',
                description: 'Some description...'
            }
            #swagger.responses[200] = {
                description: '資料修改成功',
                schema : {
                    "status": "success",
                    "data": {
                        "fileUrl": "fileUrl",
                        "fileName": "fileName"
                    }
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            let oldImage = req.user['imageName'];
            if(!req.files.length){
                return next(customiError(400, "檔案尚未上傳"))
            }
            //取得上傳檔案陣列中第一個檔案資訊．
            const file = req.files[0];
            const fileName = `images/${uuidv4()}.${file.originalname.split('.').pop()}`
            //基於檔案的原始名稱建立一個 blob 物件．
            const blob = bucket.file(fileName);
            //建立可以寫入 blob 的物件．
            const blobStream = blob.createWriteStream();
            //監聽上傳狀態，完成後觸發finish
            blobStream.on('finish', async () =>{
                //設定檔案權限
                const config = {
                    action : 'read',//讀取權限
                    expires : '12-31-2050' //網址期效
                };
                if(oldImage){
                    await bucket.file(oldImage).delete();
                }
                //回傳已儲存網址
                blob.getSignedUrl(config, async (err, fileUrl) => {
                    await User.findByIdAndUpdate(req.userId, {
                        profile_image : fileUrl,
                        imageName : fileName
                    })
                    successHandle(res, {fileUrl, fileName});
                });
            });
            //監聽失敗事件
            blobStream.on('error',(err) => {
                res.status(500).send('上傳失敗');
            });
            //將檔案的buffer寫入blobStream
            blobStream.end(file.buffer);
        } catch(err){
            console.log("imageController.js", "line 48")
            return next(customiError(400, err));
        }
    },
    //上傳背景圖片
    async uploadBackgroundImage(req, res, next){
        res.send({
            status : "success"
        })
    },
    //刪除圖片
    async removeImage(req, res, next){
        /**
         * #swagger.tags = ['ImageProcess'],
         * #swagger.description = '使用者刪除頭貼'
            #swagger.responses[200] = {
                description: '資料修改成功',
                schema : {
                    "status": "success"
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            let removeImage = req.user['imageName'];
            if(!removeImage){
                return next(400, "無獲取要刪除照片的資訊");
            }
            await bucket.file(removeImage).delete();
            await User.findOneAndUpdate(req.userId, {
                    profile_image : "",
                    imageName : ""
            })
            res.send({
                status : "success"
            })
        } catch(err){
            console.log("imageController.js", "line 64");
            return next(customiError(400, err));
        }
    }
}


module.exports = imageController