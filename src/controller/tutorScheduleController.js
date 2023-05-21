const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const TutorSchedule = require('../models/tutorScheduleModel');

const tutorScheduleController = {
    // 取得全部教師 - 行事曆資料
    async getAllTutorsSchedule(req, res, next){
        const allTutorsSchedule = await TutorSchedule.find();
        successHandle(res, allTutorsSchedule);
    },
    // 取得單一教師 - 行事曆資料
    async getSchedule(req, res, next){
        try {
            const id = req.params.tutorId;
            const schedule = await TutorSchedule.findOne({ "tutorId" : id });
            if(schedule) {
                successHandle(res, schedule);
            } else {
                return next(customiError(400, "無此 ID 帳號資訊"))
            }
        } catch(err) {
            return next(err);
        }
    },
    // 新增單一教師 - 行事曆資料
    // async createSchedule(req, res, next){
    //     try {
    //         const { body } = req;
    //         const newSchedule = await TutorSchedule.create({
    //             dates: body.dates
    //         });
    //         successHandle(res, newSchedule);
    //     } catch(err) {

    //     }
    // },
    // 修改單一教師 - 行事曆資料
    async updateSchedule(req, res, next){
        try {
            const id = req.params.tutorId;
            const { body } = req;
            const routineDayTime = body.routine_dayTime;
            const dates = body.dates;
            const updatedSchedule = await TutorSchedule.findOneAndUpdate(
                { "tutorId" : id}, 
                { dates: dates, routine_dayTime: routineDayTime}, 
                { new : true});
            successHandle(res, updatedSchedule);
        } catch(err) {
            return next(err);
        } 
    },
    // 取得單一教師 - 行事曆設定 (v-calendar 格式)
    async getScheduleV(req, res, next){
        try {
            const id = req.params.tutorId;
            const schedule = await TutorSchedule.findOne({ "tutorId" : id });
            const result = schedule.dates.reduce((aryRS, date) => {
                const year = date.year;
                date.months.forEach(month => {
                    const monthValue = month.month;
                    
                    month.days.forEach(day => {
                        const dayValue = day.day;
                        
                        day.time_slots.forEach(timeSlot => {
                            const sTime = timeSlot.start_time;
                            const eTime = timeSlot.end_time;

                            const aryV = [year, monthValue, dayValue, sTime, eTime];
                            aryRS.push(aryV);
                        })
                    })
                })

                return aryRS;
            }, []);
            if(result) {
                successHandle(res, result);
            } else {
                return next(customiError(400, "無此 ID 帳號資訊"))
            }
        } catch(err) {
            return next(err);
        }
    },
    // 修改單一教師 - 行事曆資料 (v-calendar 格式)
    async updateScheduleV(req, res, next){
        try {
            const id = req.params.tutorId;
            const { body } = req;
            const routineDayTime = body.routine_dayTime;
            const dates = body.dates;
            const data = {};

            dates.forEach( entry => {
                const year = entry[0];
                const month = entry[1];
                const day = entry[2];
                const sTime = entry[3];
                const eTime = entry[4];

                if(!data[year]){
                    data[year] = {
                        months: {}
                    };
                }

                if(!data[year].months[month]) {
                    data[year].months[month] = {
                        days: {}
                    }
                }

                if(!data[year].months[month].days[day]) {
                    data[year].months[month].days[day] = {
                        time_slots: []
                    }
                }

                const timeSlot = {
                    start_time: sTime,
                    end_time: eTime
                }

                data[year].months[month].days[day].time_slots.push(timeSlot);
            });

            // 組成 database 儲存格式
            const result = {
                dates: []
            }

            Object.keys(data).forEach( year => {
                const objYear = {
                    year: parseInt(year),
                    months: []
                };

                Object.keys(data[year].months).forEach( month => {
                    const objMonth = {
                        month: parseInt(month),
                        days: []
                    }

                    Object.keys(data[year].months[month].days).forEach( day => {
                        const objDay = {
                            day: parseInt(day),
                            time_slots: data[year].months[month].days[day].time_slots
                        };

                        objMonth.days.push(objDay);
                    })

                    objYear.months.push(objMonth);
                });

                result.dates.push(objYear);
            });
            console.log(result);

            const updatedSchedule = await TutorSchedule.findOneAndUpdate(
                { "tutorId" : id}, 
                { dates: result }, 
                { new : true});
            successHandle(res, updatedSchedule);
        } catch(err) {
            return next(err);
        } 
    },
}

module.exports = tutorScheduleController;