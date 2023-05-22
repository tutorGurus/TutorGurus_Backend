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

            // 將前端傳來的陣列資料整理
            dates.forEach(entry => {
                const year = entry[0];
                const month = entry[1];
                const day = entry[2];
                const startTime = entry[3];
                const endTime = entry[4];

                if (!data[year]) {
                    data[year] = {
                        months: {}
                    };
                }

                if (!data[year].months[month]) {
                    data[year].months[month] = {
                        days: {}
                    };
                }

                if (!data[year].months[month].days[day]) {
                    data[year].months[month].days[day] = {
                        time_slots: []
                    };
                }

                const timeSlot = {
                    start_time: startTime,
                    end_time: endTime
                };

                data[year].months[month].days[day].time_slots.push(timeSlot);
            });
            // console.log(JSON.stringify(data, null, 2));
            const result = {
                dates: []
            };
            
            // 將 資料 重組成 database 格式
            Object.keys(data).forEach(year => {
                const yearObj = {
                    year: parseInt(year),
                    months: []
                };

                Object.keys(data[year].months).forEach(month => {
                    const monthObj = {
                        month: parseInt(month),
                        days: []
                    };

                    Object.keys(data[year].months[month].days).forEach(day => {
                        const dayObj = {
                            day: parseInt(day),
                            time_slots: data[year].months[month].days[day].time_slots
                        };

                    monthObj.days.push(dayObj);
                    });

                    yearObj.months.push(monthObj);
                });

                result.dates.push(yearObj);
            });
            
            // console.log(JSON.stringify(result, null, 2));

            // 將資料更新至 database
            for (const yearData of result.dates) {
                // 確認 database 中是否有該「年度」的資料 (可用於跨年度)
                const dbYear = await TutorSchedule.findOne({"dates.year": yearData.year});
                // 若資料庫無該「年度」的資料，則新增資料
                if (!dbYear) {
                    const newSchedule = await TutorSchedule.findOneAndUpdate(
                        {
                            "tutorId" : id
                        },
                        {
                            dates: result.dates
                        },
                        {
                            new: true
                        }
                    );
                }
                for (const monthData of yearData.months) {
                    // 確認 database 中是否有該「月份」的資料
                    const dbMonth = await TutorSchedule.findOne({"dates.months.month": monthData.month});
                    // 若資料庫無該「月份」的資料，則新增資料
                    if (!dbMonth) {
                        const newSchedule = await TutorSchedule.findOneAndUpdate(
                            {
                                "tutorId" : id,
                                "dates.year": yearData.year
                            },
                            {
                                $push: {
                                    "dates.$[outer].months": monthData
                                }
                            },
                            {
                                new: true,
                                arrayFilters: [
                                    { "outer.year": yearData.year },
                                ],
                            }
                        );
                    }
                    for (const dayData of monthData.days) {
                        // 確認 database 中是否有該「日期」的資料
                        const dbDay = await TutorSchedule.findOne({"dates.months.days.day": dayData.day});
                        // 若資料庫無該「日期」的資料，則新增資料
                        if (!dbDay) {
                            const newSchedule = await TutorSchedule.findOneAndUpdate(
                                {
                                    "tutorId" : id,
                                    "dates.year": yearData.year,
                                    "dates.months.month": monthData.month
                                },
                                {
                                    $push: {
                                        "dates.$[outer].months.$[inner].days": dayData
                                    }
                                },
                                {
                                    new: true,
                                    arrayFilters: [
                                        { "outer.year": yearData.year },
                                        { "inner.month": monthData.month }
                                    ],
                                }
                            );
                        } else { // 更新該日期時段資料
                            const updatedSchedule = await TutorSchedule.findOneAndUpdate(
                                {
                                    tutorId: id,
                                    "dates.year": yearData.year,
                                    "dates.months.month": monthData.month,
                                    "dates.months.days": { $elemMatch: { day: dayData.day } },
                                },
                                {
                                    "dates.$[outer].months.$[inner].days.$[dayFilter].time_slots": dayData.time_slots,
                                },
                                {
                                    new: true,
                                    arrayFilters: [
                                        { "outer.year": yearData.year },
                                        { "inner.month": monthData.month },
                                        { "dayFilter.day": dayData.day },
                                    ],
                                }
                            );
                        }
                    }
                }
            }
            successHandle(res, "OK");
        } catch(err) {
            return next(err);
        } 
    }
}

module.exports = tutorScheduleController;