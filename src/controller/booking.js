const Booking = require('../models/bookingModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');

let bookingsController = {
    // 學生查詢預約列表
    async bookingList(req, res, next){
        try{
            let id  = req.user._id;
            id = id.toHexString();
            const bookingList = await Booking.find({
                booking_user_id: id,
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
            const { booked_user_id, course_id, startTime, endTime } = req.body;
            let id  = req.user._id;
            id = id.toHexString();
            
            const bookingCourse = await Booking.create({
                booking_user_id: id,
                booked_user_id: booked_user_id,
                course_id: course_id,
                startTime: startTime,
                endTime: endTime,
                status: 'booked',
                room_link: 'temp.zoom.link'
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
            console.log(id);
            const changeBookingStatus = await Booking.findByIdAndUpdate(id,
                {
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
            
            const editZoomLink = await Booking.findByIdAndUpdate(id,
                {
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