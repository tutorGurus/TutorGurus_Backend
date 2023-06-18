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
            });
            console.log(bookingList)
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
                booked_user_id: id,
            })
            .populate({
                path: "booking_user_id",
                select: "name email -carts -_id",
            }).populate({
                path: "course_id",
                select : "-user_id -createAt -updateAt -_id"
            }).select("-_id");
            successHandle(res, bookedList);
        } catch(err){
            return next(err);
        }
    },
    // 預約課程Ver.1
    async bookingCourse1(req, res, next){
        /**
            #swagger.tags = ['Booking']
         */
        try{
            const { course_id, startTime, endTime } = req.body;
            let id  = req.user._id;
            id = id.toHexString();
            let bookedUserID = await Course.findById(course_id).select('user_id -_id');
        //avocado ============ ceiling 
            if(!bookedUserID || !ObjectId.isValid(course_id)){
                return next(customiError(400, "無此課程資訊可預約或課程ID有誤"));
            };
            let startTransfer = new Date(startTime);
            const bookingList = await Booking.find({ booking_user_id: id })
            for(let obj of bookingList){
                let existTime = obj["startTime"].getTime();
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
    // 預約課程Ver.2
    async bookingCourse(req, res, next){
    /**
        * #swagger.tags = ['Booking']
        * #swagger.description = '預約課程'
        * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : {
                    $bookingList : [{
                        "courseid" : "courseID",
                        "tutorid" : "tutorID of the course",
                        "starttime" : "booking time with time stamp"
                    }]
                    
                }
            }
        * #swagger.responses[200] = {
                description: '註冊成功',
                schema : {
                    "status": "success",
                    "data": [
                        {
                            "booking_user_id": "6486025f1113d3f14cf5cbb4",
                            "booked_user_id": "6482ad57777782004e4c5550",
                            "course_id": "648dc0586e93a5bfccefdde6",
                            "status": "booked",
                            "room_link": "temp.zoom.link",
                            "startTime": "1976-05-30T12:08:20.899Z",
                            "endTime": "1976-05-30T12:58:20.899Z",
                            "_id": "648ee47b828a698a43b09a68",
                            "createdAt": "2023-06-18T11:03:23.448Z",
                            "updatedAt": "2023-06-18T11:03:23.448Z"
                        }
                    ]
                }
            }
     */
    try {
        let id = req.user["_id"];
        const bookingList = req.body["bookingList"];
        if (!bookingList) {
            return next(customiError(400, "請帶入欲預約的課程"));
        }
        if (!bookingList.length) {
            return next(customiError(400, "請帶入欲預約的課程"));
        }
        let existTutorBookingId;
        let existTutorBookingList;
        for (let bookedCourse of bookingList) {
        if (
            existTutorBookingId == undefined ||
            existTutorBookingId != existTutorBookingId
          ) {
            existTutorBookingId = bookedCourse["tutorid"];
            if (!ObjectId.isValid(existTutorBookingId)) {
              return next(customiError(400, "資料格式錯誤(tutorid)"));
            }
            existTutorBookingList = await Booking.find({
              booked_user_id: existTutorBookingId,
            });
          }
          for (let checkBookingStatus of existTutorBookingList) {
            if (
              checkBookingStatus["startTime"].getTime() ==
                parseInt(bookedCourse["starttime"]) ||
              checkBookingStatus == "booked"
            ) {
              return next(customiError(400, "此老師該時段已經有預約的課程"));
            }
          }
        }
        const existStudentBookingList = await Booking.find({
          booking_user_id: id,
        });
        for (let bookedCourse of bookingList) {
          if (!ObjectId.isValid(bookedCourse["courseid"])) {
            return next(customiError(400, "課程資訊錯誤(ID)"));
          }
          let checkCourse = await Course.findById(bookedCourse["courseid"]);
          if (!checkCourse) {
            return next(customiError(400, "無課程資訊"));
          }
          for (let checkBookingStatus of existStudentBookingList) {
            if (
              checkBookingStatus["startTime"].getTime() ==
                parseInt(bookedCourse["starttime"]) ||
              checkBookingStatus == "booked"
            ) {
              return next(customiError(400, "您在該時段已經有預約的課程"));
            }
          }
        }
        let endTimeTransfer, newData;
        let returnData = [];
        for (let booking of bookingList) {
          endTimeTransfer = parseInt(booking["starttime"]) + 50 * 60 * 1000;
          newData = await Booking.create({
            booking_user_id: id,
            booked_user_id: booking["tutorid"],
            course_id: booking["courseid"],
            // startTime : startTime,
            // endTime : endTime ,
            startTime: booking["starttime"],
            endTime: endTimeTransfer,
            status: "booked",
            room_link: "temp.zoom.link",
          });
          returnData.push(newData);
        }
        successHandle(res, returnData);
      } catch (err) {
        console.log(err);
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