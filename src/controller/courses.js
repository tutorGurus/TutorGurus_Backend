const Course = require('../models/coursesModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');

const coursesController = {
    // 取得所有課程
    async getAllCourses(req, res, next) {
        const courses = await Course.find();
        successHandle(res, courses);
    },
    // 新增課程
    async createCourse(req, res, next) {
        try {
            const { body } = req;
            if(!body.title || !body.category || !body.price)
                return next(customiError(400, "欄位未填寫完整"));
            const newCourse = await Course.create(
                {
                    user_id: body.user_id,
                    title: body.title,
                    category: body.category,
                    price: body.price,
                    introduction: body.introduction,
                    preparation: body.preparation,
                    is_publish: body.is_publish
                }
            );
            successHandle(res, newCourse);
        } catch(err) {
            return next(err);
        }
    },
    // 取得單一課程資訊
    async getCourse(req, res, next) {
        try {
            const id = req.params.courseId;
            const course = await Course.findById(id).populate({
                path: "user_id",
                select: "name email"
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
        try {
            const id = req.params.courseId;
            const { body } = req;
            const updatedCourse = await Course.findByIdAndUpdate(id, {
                title: body.title,
                category: body.category,
                price: body.price,
                introduction: body.introduction,
                preparation: body.preparation,
                is_publish: body.is_publish
            });
            successHandle(res, updatedCourse);
        } catch(err) {
            return next(err);
        }
    },
    // 刪除課程
    async deleteCourse(req, res, next) {
        try {
            const id = req.params.courseId;
            const deletedCourse = await Course.findByIdAndDelete(id);
            if(deletedCourse) {
                successHandle(res, deletedCourse);
            } else {
                return next(customiError(400, "無此課程ID"));
            }
        } catch(err) {
            return next(err);
        }
    }
}

module.exports = coursesController;