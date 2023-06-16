const Course = require('../models/coursesModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const ClassPrice = require('../models/classPriceModel');
const User = require('../models/userModel');
const { log } = require('debug/src/node');
const { query } = require('express');

const coursesController = {
    //設定課程種類價格
    async newClassPrice(req, res, next){
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '設定課程種類價格API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    "category" : "國文",
                    "grade" : "國一",
                    "price" : "700",
                }
            }
           * #swagger.responses[200] = {
                description: 'OK',
                schema :
                {
                    "status": "success",
                    "data": "新增成功"
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            const id = req.user['_id'];
            const { body } = req;
            if(req.user["role"] != "T" || req.user["status"] != "tutor"){
                return next(customiError(400, "尚未有教師身分"));
            };
            if(!body.category || !body.grade || !body.price){
                return next(customiError(400, "請填寫完整開課價格資訊"));
            };
            const tutor = await User.findById(id);
            if(tutor.status != "tutor"){
                return next(customiError(400, "您沒有開課權限!"));
            };
            if(!body.grade || !body.category || !body.price){
                return next(customiError(400, "資料未填寫完整"));
            };
            let course = await ClassPrice.find({
                    user_Id : id,
                    category : body.category,
                    grade :  body.grade 
            });
            if(course.length){
                return next(customiError(400, "已有相同學程"));
            }
            let newData = await ClassPrice.create({
                user_Id : id,
                category : body.category,
                grade : body.grade,
                price : body.price
            });
            successHandle(res, newData);
        } catch (err){
            console.log(err)
        }
    },
    //修改課程種類價格
    async editClassPrice(req, res, next){
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '修改課程種類價格API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    "price" : "新價格",
                    "classId" : "課程類別ID(不是課程ID)"
                }
            }
           * #swagger.responses[200] = {
                description: 'OK',
                schema :
                {
                    "status": "success",
                    "data": "修改成功"
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            const { price, classId } = req.body;
            if( !price || !classId){
                return next(customiError(400, "請填寫必要欄位"));
            };
            const findClass = await ClassPrice.findById(classId);
            if(!findClass){
                return next(customiError(400, "未找到相關課程資訊"));
            };
            await ClassPrice.findByIdAndUpdate(classId, {
                price : price,
            });
            res.send({
                status : "success",
                message : "修改成功"
            })
        } catch (err){
            console.log(err)
        }
    },
    //刪除課程類別
    async deleteClassPrice(req, res, next){
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '刪除課程種類價格API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    "classId" : "課程類別ID(不是課程ID)"
                }
            }
           * #swagger.responses[200] = {
                description: 'OK',
                schema :
                {
                    "status": "success",
                    "data": "刪除成功"
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try{
            const userId = req.user['_id'];
            const { classId } = req.body;
            if( !classId ){
                return next(customiError(400, "請帶入欲刪除類別的ID"));
            };
            const findClassFromDB = await Course.find({
                price_id : classId,
            });
            if(findClassFromDB.length){
                return next(customiError(400, "此類別下尚有課程內容"));
            };
            await ClassPrice.findByIdAndDelete(classId);
            res.send({
                status : "success",
                message : "刪除成功"
            })
        } catch(err){
            console.log(err);
        }
    },
    // 取得該教師開設的所有課程
    async getAllCourses(req, res, next) {
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '取得該教師開設的所有課程 API'
        #swagger.responses[200] = {
            description: 'OK',
            schema :
            {
                "status": "success",
                "data": [
                    {
                        "_id": "647779405052793982a3fd4d",
                        "user_id": "647777fa5052793982a3fd3f",
                        "education_stages": "高中",
                        "grade": "高一",
                        "semester": "上學期",
                        "category": "數學",
                        "title": "數與數線",
                        "price": "ˊ600",
                        "introduction": "高中數學得基礎，必須要學好",
                        "preparation": [
                            {
                                "item_title": "課程預約須知",
                                "content": "預約課程時段前，請先用「聯絡老師」跟老師先確認想上的課程內容後再預約時間。",
                                "_id": "647779405052793982a3fd4e"
                            },
                            {
                                "item_title": "上課說明",
                                "content": "<p>1.開課前 10 分鐘進入網站，選擇『我的課程』找到該堂課並點選『進入教室』，即可開啟 ZOOM 教室開始上課。</p> <p>2.手機、電腦皆可使用 ZOOM 上課（手機請先下載 ZOOM 應用程式）</p>",
                                "_id": "647779405052793982a3fd4f"
                            }
                        ],
                        "is_publish": true,
                        "status": "上架",
                        "rate": 0,
                        "createdAt": "2023-05-31T16:43:44.117Z",
                        "updatedAt": "2023-05-31T16:43:44.117Z"
                    }
                ]
            }
        }
        * #swagger.security = [{
        "JwtToken" : []
        }]
        */
        let userId  = req.user['_id'];
        const courses = await Course.find({
            user_id:userId
        });
        if (courses) {
            successHandle(res, courses);
        } else {
            return next(customiError(400, "無此 老師ID帳號的資料，請重新確認！"));
        }
    },
    // 新增課程
    async createCourse(req, res, next) {
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '新增課程 API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    "education_stages": "高中",
                    "grade": "高一",
                    "semester": "上學期",
                    "title": "數與數線",
                    "category": "數學",
                    "price": "ˊ600",
                    "introduction": "高中數學得基礎，必須要學好",
                    "preparation" :[
                        {
                            "item_title": "課程預約須知",
                            "content": "預約課程時段前，請先用「聯絡老師」跟老師先確認想上的課程內容後再預約時間。"
                        },
                        {
                            "item_title": "上課說明",
                            "content": "<p>1.開課前 10 分鐘進入網站，選擇『我的課程』找到該堂課並點選『進入教室』，即可開啟 ZOOM 教室開始上課。</p> <p>2.手機、電腦皆可使用 ZOOM 上課（手機請先下載 ZOOM 應用程式）</p>"     
                        }],
                    "is_publish": true,
                    "status": "上架"
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const { body } = req;
            const { grade, category, title} = req.body;
            let userId  = req.user['_id'];
            let coursePriceList = await ClassPrice.find({
                user_Id : userId,
                grade : grade,
                category : category
            });
            if(req.user["role"] != "T" || req.user["status"] != "tutor"){
                return next(customiError(400, "尚未有教師身分"));
            }
            if(!coursePriceList.length){
                return next(customiError(400, "請先設定課程類別價格"));
            };
            userId = userId.toHexString();
            if(!body.title || !body.category){
                return next(customiError(400, "欄位未填寫完整"));
            };
            let tutorCourseInfo = await Course.find({ title : title });
            if(tutorCourseInfo.length){
                return next(customiError(400, "已有相同課程名稱的課程正在授課"));
            };
            const newCourse = await Course.create(
                {
                    price_id : coursePriceList[0]["_id"],
                    user_id: userId,
                    education_stages: body.education_stages,
                    grade: body.grade,
                    semester: body.semester,
                    category: body.category,
                    title: body.title,
                    introduction: body.introduction,
                    preparation: body.preparation,
                    is_publish: body.is_publish,
                    status: body.status,
                }
            );
            successHandle(res, newCourse);
        } catch(err) {
            return next(err);
        }
    },
    // 取得單一課程資訊
    async getCourse(req, res, next) {
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '取得單一課程資訊API'
        #swagger.responses[200] = {
            description: 'OK',
            schema :
            {
                "status": "success",
                "data": [
                    {
                        "_id": "647779405052793982a3fd4d",
                        "user_id": "647777fa5052793982a3fd3f",
                        "education_stages": "高中",
                        "grade": "高一",
                        "semester": "上學期",
                        "category": "數學",
                        "title": "數與數線",
                        "price": "ˊ600",
                        "introduction": "高中數學得基礎，必須要學好",
                        "preparation": [
                            {
                                "item_title": "課程預約須知",
                                "content": "預約課程時段前，請先用「聯絡老師」跟老師先確認想上的課程內容後再預約時間。",
                                "_id": "647779405052793982a3fd4e"
                            },
                            {
                                "item_title": "上課說明",
                                "content": "<p>1.開課前 10 分鐘進入網站，選擇『我的課程』找到該堂課並點選『進入教室』，即可開啟 ZOOM 教室開始上課。</p> <p>2.手機、電腦皆可使用 ZOOM 上課（手機請先下載 ZOOM 應用程式）</p>",
                                "_id": "647779405052793982a3fd4f"
                            }
                        ],
                        "is_publish": true,
                        "status": "上架",
                        "rate": 0,
                        "createdAt": "2023-05-31T16:43:44.117Z",
                        "updatedAt": "2023-05-31T16:43:44.117Z"
                    }
                ]
            }
        }
        * #swagger.security = [{
        "JwtToken" : []
        }]
        */
        try {
            const courseId = req.params.courseId;
            const course = await Course.findById(courseId).populate({
                path: "user_id",
                select: "name"
            }).populate({
                path : "price_id",
                select : "price -_id"
            });
            if(course) {
                successHandle(res, course);
            } else {
                return next(customiError(400, "無此課程ID資訊！"));
            }
        } catch(err) {
            return next(err);
        }
    },
    // 更新課程
    async updateCourse(req, res, next) {
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '更新單筆課程API'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    "education_stages": "高中",
                    "grade": "高二",
                    "semester": "上學期",
                    "title": "三角函數",
                    "category": "數學",
                    "price": "ˊ600",
                    "introduction": "直角三角形的邊角關係、廣義角與極坐標、廣義角與極坐標",
                    "preparation" :[
                        {
                            "item_title": "課程預約須知",
                            "content": "預約課程時段前，請先用「聯絡老師」跟老師先確認想上的課程內容後再預約時間。"
                        },
                        {
                            "item_title": "上課說明",
                            "content": "<p>1.開課前 10 分鐘進入網站，選擇『我的課程』找到該堂課並點選『進入教室』，即可開啟 ZOOM 教室開始上課。</p> <p>2.手機、電腦皆可使用 ZOOM 上課（手機請先下載 ZOOM 應用程式）</p>"     
                        }],
                    "is_publish": true,
                    "status": "上架"
                }
            }    
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.courseId;
            const { body } = req;
            const updatedCourse = await Course.findByIdAndUpdate(id, {
                title: body.title,
                education_stages: body.education_stages,
                grade: body.grade,
                semester: body.semester,
                category: body.category,
                title: body.title,
                price: body.price,
                introduction: body.introduction,
                preparation: body.preparation,
                is_publish: body.is_publish,
                status: body.status
            });
            successHandle(res, "完成課程資料更新！");
        } catch(err) {
            return next(err);
        }
    },
    // 刪除單筆課程
    async deleteCourse(req, res, next) {
        /**
         * #swagger.tags = ['Courses'],
         * #swagger.description = '刪除單筆課程API'
         * #swagger.parameters['courseId'] = {
                    in: 'path',
                    description: 'Course ID.' 
            }
            #swagger.responses[200] = {
                description: '刪除成功',
                schema : {
                    "status": "success",
                    "data": {
                        "status": "",
                        "rate": 0,
                        "_id": "647618c9f79f6c4b1286b391",
                        "user_id": "6474a234bb279f17099142e5",
                        "title": "背景",
                        "category": "國一國文",
                        "price": "580",
                        "introduction": "朱志清的作品",
                        "is_publish": true,
                        "createdAt": "2023-05-30T15:39:53.060Z",
                        "updatedAt": "2023-05-30T15:39:53.060Z",
                        "preparation": []
                    }
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.courseId;
            const deletedCourse = await Course.findByIdAndDelete(id);
            if(deletedCourse) {
                successHandle(res, "刪除成功");
            } else {
                return next(customiError(400, "無此課程ID"));
            }
        } catch(err) {
            return next(err);
        }
    },
    //課程一覽(首頁篩選想學課程)
    async courseListWithFilter(req, res, next){
        try {
            const queryContent = req.query;
            let course_education_stages = queryContent['education_stages'] != undefined 
                ? queryContent['education_stages'] 
                : 0;
            let course_category = queryContent["category"] != undefined
                ? queryContent["category"]
                : 0;
            let course_grade = queryContent['grade'] != undefined 
                ? queryContent['grade']
                : 0;
            let courseList;
            if (!course_education_stages && !course_category && !course_grade){
                courseList = await Course.find().populate({
                    path: "user_id",
                    select: "name profile_image tutorIdCustom -carts",
                });;
                successHandle(res, courseList);
                return;
            }
            if(course_grade == `所有${course_education_stages}課程`){
                courseList = await Course.find({
                    education_stages: course_education_stages,
                    category: course_category,
                }).populate({
                    path: "user_id",
                    select: "name profile_image tutorIdCustom -carts",
                });
                successHandle(res, courseList);
                return;
            }
            console.log(course_education_stages, course_category, course_grade)
            courseList = await Course.find({
                education_stages : course_education_stages,
                category : course_category,
                grade : course_grade,
            }).populate({
                path: "user_id",
                select: "name profile_image tutorIdCustom -carts",
            });
            successHandle(res, courseList);
        } catch(err){
            console.log(err);
        }
    }
}

module.exports = coursesController;