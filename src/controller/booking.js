const Booking = require('../models/bookingModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');

let bookingsController = {
    // 學生查詢預約列表
    async bookingList(req, res, next){
        try{
            const { id } = req.user._id;
            
            const bookingList = await Booking.find({
                booking_user_id : id,
            })
            successHandle(res, bookingList);
        } catch(err){
            return next(err);
        }
    },
    // 老師查詢預約列表
    async bookedList(req, res, next){
        try{
            const { id } = req.user._id;
            
            const bookedList = await Booking.find({
                booked_user_id : id,
            })
            successHandle(res, bookedList);
        } catch(err){
            return next(err);
        }
    },
    // 預約課程
    async bookingCourse(req, res, next){
        try{
            const {id, course_id, startTime, endTime } = req.body;
            
            const bookingCourse = await Booking.create({
                booking_user_id: id,
                course_id: course_id,
                startTime: startTime,
                endTime: endTime,
            })
            successHandle(res, bookingCourse);
        } catch(err){
            return next(err);
        }
    },
    // 請假、取消預約
    async editBookingStatus(req, res, next){
        try{
            const { id, status } = req.body;
            
            const changeBookingStatus = await Booking.findOneAndUpdate({
                id: id,
            },{
                $set:{
                    status: status,
                }
            },{ new : true })
            successHandle(res, changeBookingStatus);
        } catch(err){
            return next(err);
        }
    },

    // 修改課程 Zoom Link
    async editZoomLink(req, res, next){
        try{
            const { id, link } = req.body;
            
            const editZoomLink = await Booking.findOneAndUpdate({
                id: id,
            },{
                $set:{
                    room_link: link,
                }
            },{ new : true })
            successHandle(res, editZoomLink);
        } catch(err){
            return next(err);
        }
    },

}

module.exports = bookingsController;