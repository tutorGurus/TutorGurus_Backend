const Booking = require('../models/bookingModel');
const Course = require('../models/coursesModel');
const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; //Avocado

let bookingsController = {
    // 學生查詢預約列表
    async bookingList(req, res, next){
        /**
            #swagger.tags = ['Booking']
         */
        try{
            let id  = req.user._id;
            id = id.toHexString();
            const bookingList = await Booking.find({
                booking_user_id: id,
            })
        //avocado ========== ceiling 
            let searchBookingList = JSON.parse(JSON.stringify(bookingList));
            console.log(new Date(searchBookingList[0]["startTime"]).toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false }));
            for(let i = 0; i < searchBookingList.length; i++){
                searchBookingList[i]["startTime"] = new Date(searchBookingList[i]["startTime"]).toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false });
                searchBookingList[i]["endTime"] = new Date(searchBookingList[i]["endTime"]).toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false });
            }
        //avocado =========== floor
            //successHandle(res, searchBookingList);
            successHandle(res, bookingList);
        } catch(err){
            return next(err);
        }
    },
    // 老師查詢預約列表
    async bookedList(req, res, next){
        /**
            #swagger.tags = ['Booking']
         */
        try{
            let id  = req.user._id;
            id = id.toHexString();
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
        /**
            #swagger.tags = ['Booking']
         */
        try{
            const { course_id, startTime, endTime} = req.body;
            let id  = req.user._id;
            id = id.toHexString();
            let bookedUserID = await Course.findById(course_id).select('user_id -_id');
        //avocado ============ ceiling 
            if(!bookedUserID || !ObjectId.isValid(course_id))
                return next(customiError(400, "無此課程資訊可預約或課程ID有誤"));
            // let startTransfer = new Date("2023/05/31 22:00");
            let startTransfer = new Date("2023/05/31 22:00");
            console.log(startTransfer);
            const bookingList = await Booking.find({ booking_user_id: id })
            for(let obj of bookingList){
                console.log(obj);
                let existTime = obj["startTime"].getTime();
                console.log(startTransfer.getTime == existTime);
                if(startTransfer.getTime() == existTime && obj["status"] == "booked"){
                    return next(customiError(400, "該時段已經有預約的課程"));
                }
            }
            let endTransfer = new Date(startTransfer.getTime() + 50*60*1000);
        //avocado ============ floor 

            bookedUserID = bookedUserID.user_id.toHexString();

            const bookingCourse = await Booking.create({
                booking_user_id: id,
                booked_user_id: bookedUserID,
                course_id: course_id,
                // startTime : startTime,
                // endTime : endTime ,
                startTime: startTransfer,
                endTime: endTransfer,
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
        /**
            #swagger.tags = ['Booking']
         */
        try{
            const { bookingID, status } = req.body;
            const changeBookingStatus = await Booking.findByIdAndUpdate(bookingID,
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
          /**
            #swagger.tags = ['Booking']
         */
        try{
            const { bookingID, link } = req.body;          
            const editZoomLink = await Booking.findByIdAndUpdate(bookingID,
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