const customiError = require('../errorHandler/customiError');
const successHandle = require('../service/successHandler');
const TutorSchedule = require('../models/tutorScheduleModel');

const tutorScheduleController = {
    // 取得單一教師 - 全部行事曆資料
    async getAllTutorsSchedule(req, res, next){ 
    /**
    * #swagger.tags = ['TutorSchedule'],
    * #swagger.description = '取得單一教師 - 全部行事曆資料'
    #swagger.responses[200] = {
        description: 'OK',
        schema :
            {
                "status": "success",
                "data": {
                    "_id": "6471760377d41e94b24fe00e",
                    "tutorId": "6471760377d41e94b24fe00a",
                    "dates": [
                        {
                            "year": 2023,
                            "months": [
                                {
                                    "month": 5,
                                    "days": [
                                        {
                                            "day": 30,
                                            "time_slots": [
                                                [
                                                    "17:00",
                                                    "18:00"
                                                ],
                                                [
                                                    "19:00",
                                                    "21:00"
                                                ]
                                            ],
                                            "flag": false,
                                            "_id": "6471761577d41e94b24fe029"
                                        },
                                        {
                                            "day": 31,
                                            "time_slots": [
                                                [
                                                    "18:00",
                                                    "20:00"
                                                ],
                                                [
                                                    "21:00",
                                                    "22:00"
                                                ]
                                            ],
                                            "flag": false,
                                            "_id": "6471761577d41e94b24fe031"
                                        },
                                    ],
                                    "_id": "6471761577d41e94b24fe013"
                                },
                                {
                                    "month": 6,
                                    "days": [
                                        {
                                            "day": 7,
                                            "time_slots": [
                                                [
                                                    "08:00",
                                                    "10:00"
                                                ],
                                                [
                                                    "10:00",
                                                    "12:00"
                                                ]
                                            ],
                                            "flag": false,
                                            "_id": "64717670832f6d5ce0c1c3fb"
                                        }
                                    ]
                                }
                            ],
                            "_id": "6471761577d41e94b24fe012"
                        }
                    ]
                }
            }
        }
        * #swagger.security = [{
        "JwtToken" : []
        }]
        */
        const id = req.params.tutorId;
        const scheduleAll = await TutorSchedule.find({ "tutorId" : id });
        if (scheduleAll) {
            successHandle(res, scheduleAll);
        } else {
            return next(customiError(400, "無此 tutorID 帳號的資料，請重新確認！"));
        }
    },
    // 取得單一教師 - 行事曆資料
    async getSchedule(req, res, next){
        /**
        * #swagger.tags = ['TutorSchedule'],
        * #swagger.description = '取得單一教師 - 行事曆資料（特定 年度 及 月份區間）'
        * #swagger.parameters['year'] = {
            in: 'query',
            name: 'year',
            description: '請輸入年度，如： 2023',
            schema: {
                type: 'integer'
            },
            required: true
        }
        * #swagger.parameters['startMonth'] = {
            in: 'query',
            name: 'startMonth',
            description: '請輸入開始月份，如： 5',
            schema: {
                type: 'integer'
            },
            required: true
        }
        * #swagger.parameters['endMonth'] = {
            in: 'query',
            name: 'endMonth',
            description: '請輸入結束月份，如： 6',
            schema: {
                type: 'integer'
            },
            required: true
        }
        #swagger.responses[200] = {
            description: 'OK',
            schema :
            {
                "_id": "6471760377d41e94b24fe00e",
                "tutorId": "6471760377d41e94b24fe00a",
                "dates": [
                    {
                        "year": 2023,
                        "months": [
                            {
                                "month": 5,
                                "days": [
                                    {
                                        "day": 30,
                                        "time_slots": [
                                            [
                                                "17:00",
                                                "18:00"
                                            ],
                                            [
                                                "19:00",
                                                "21:00"
                                            ]
                                        ],
                                        "flag": false,
                                        "_id": "6471761577d41e94b24fe029"
                                    },
                                    {
                                        "day": 31,
                                        "time_slots": [
                                            [
                                                "18:00",
                                                "20:00"
                                            ],
                                            [
                                                "21:00",
                                                "22:00"
                                            ]
                                        ],
                                        "flag": false,
                                        "_id": "6471761577d41e94b24fe031"
                                    },
                                ],
                                "_id": "6471761577d41e94b24fe013"
                            },
                        ],
                        "_id": "6471761577d41e94b24fe012"
                    }
                ]
            }
        }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.tutorId;
            const inputYear = parseInt(req.query.year);
            const inputStartMonth = parseInt(req.query.startMonth);
            const inputEndMonth = parseInt(req.query.endMonth);
            const schedule = await TutorSchedule.aggregate([
                {
                    $match: { $expr: { $eq: ['$tutorId', { $toObjectId: id }] } }
                },
                {
                    $project: {
                        tutorId: 1,
                        dates: {
                            $map: {
                                input: "$dates",
                                as: "date",
                                in: {
                                    year: "$$date.year",
                                    months: {
                                        $filter: {
                                            input: "$$date.months",
                                            as: "month",
                                            cond: {
                                                $and: [
                                                    { $eq: [ "$$date.year", inputYear ] },
                                                    { $gte: [ "$$month.month", inputStartMonth ] },
                                                    { $lte: [ "$$month.month", inputEndMonth ] }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {   // 過濾資料中 dates 陣列中的元素，只留下其中的 months 陣列長度不為 0 的元素。
                    $project: {
                        tutorId: 1,
                        dates: { 
                            $filter: { 
                                input: "$dates", 
                                as: "date", 
                                cond: { 
                                    $ne: [ { $size: "$$date.months" }, 0 ] 
                                } 
                            } 
                        }
                    }
                },
                { // 重組資料格式，不顯示各階層 _id 資訊
                    $project: {
                        tutorId: 1,
                        dates: {
                            $map: {
                                input: "$dates",
                                as: "date",
                                in: {
                                    year: "$$date.year",
                                    months: {
                                        $map: {
                                            input: "$$date.months",
                                            as: "month",
                                            in: {
                                                month: "$$month.month",
                                                days: {
                                                    $map: {
                                                        input: "$$month.days",
                                                        as: "day",
                                                        in: {
                                                            day: "$$day.day",
                                                            time_slots: "$$day.time_slots",
                                                            flag: "$$day.flag"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]);
            if (schedule) {
                successHandle(res, schedule);
            } else {
                return next(customiError(400, "無此 tutorID 帳號的資料，請重新確認！"));
            }
        } catch(err) {
            return next(err);
        }
    },
    // 修改單一教師 - 行事曆資料
    async updateSchedule(req, res, next){
        /**
         * #swagger.tags = ['TutorSchedule'],
         * #swagger.description = '修改單一教師 - 行事曆資料'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    $routine_dayTime: {
                        $0: [
                            ["08:00", "12:00"]
                        ],
                        $1: [
                            ["08:00", "10:00"],
                            ["11:00", "12:00"]
                        ],
                        $2: [
                            ["13:00", "14:00"],
                            ["14:00", "16:00"]
                        ],
                        $3: [
                            ["16:00", "18:00"],
                            ["19:00", "20:00"]
                        ],
                        $4: [
                            ["21:00", "22:00"]
                        ],
                        $5: [
                            ["20:00", "22:00"]
                        ],
                        $6: [
                            ["09:00", "12:00"],
                            ["14:00", "17:00"]
                        ]
                    },
                    $dates: [
                        {
                            $year: 2023,
                            $months: [
                                {
                                    $month: 5,
                                    $days: [
                                        {
                                            $day: 20,
                                            $time_slots: [
                                                ["09:00", "10:00"],
                                                ["10:00", "12:00"],
                                                ["14:00", "17:00"]
                                            ]
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.tutorId;
            const { body } = req;
            const routineDayTime = body.routine_dayTime;
            const dates = body.dates;
            console.log(JSON.stringify(dates, null, 2));
            const updatedSchedule = await TutorSchedule.findOneAndUpdate(
                { "tutorId" : id}, 
                { dates: dates, routine_dayTime: routineDayTime}, 
                { new : true});
            successHandle(res, updatedSchedule);
        } catch(err) {
            return next(err);
        } 
    },
    // 取得單一教師 - 行事曆設定 (v-calendar 格式, 依照 年度 跟 月份區間篩選)
    async getScheduleV(req, res, next){
        /**
        * #swagger.tags = ['TutorSchedule (v-calendar)'],
        * #swagger.description = '取得單一教師 - 行事曆資料（特定 年度 及 月份區間）'
        * #swagger.parameters['year'] = {
            in: 'query',
            name: 'year',
            description: '請輸入年度，如： 2023',
            schema: {
                type: 'integer'
            },
            required: true
        }
        * #swagger.parameters['startMonth'] = {
            in: 'query',
            name: 'startMonth',
            description: '請輸入開始月份，如： 5',
            schema: {
                type: 'integer'
            },
            required: true
        }
        * #swagger.parameters['endMonth'] = {
            in: 'query',
            name: 'endMonth',
            description: '請輸入結束月份，如： 5',
            schema: {
                type: 'integer'
            },
            required: true
        }
        #swagger.responses[200] = {
            description: 'OK',
            schema :
            {
                "status": "success",
                "data": {
                    "routine_dayTime": {
                        "0": [
                            [
                                "08:00",
                                "12:00"
                            ]
                        ],
                        "1": [
                            [
                                "14:00",
                                "15:00"
                            ],
                            [
                                "15:00",
                                "16:00"
                            ],
                            [
                                "16:00",
                                "17:00"
                            ]
                        ],
                        "2": [
                            [
                                "17:00",
                                "18:00"
                            ],
                            [
                                "19:00",
                                "21:00"
                            ]
                        ],
                        "3": [
                            [
                                "18:00",
                                "20:00"
                            ]
                        ],
                        "4": [
                            [
                                "08:00",
                                "09:00"
                            ]
                        ],
                        "5": [
                            [
                                "09:00",
                                "10:00"
                            ]
                        ],
                        "6": [
                            [
                                "08:00",
                                "10:00"
                            ]
                        ],
                        "_id": "64734f5a89a535508f0d834a"
                    },
                    "dates": [
                        [
                            2023,
                            5,
                            20,
                            "09:00",
                            "10:00"
                        ],
                        [
                            2023,
                            5,
                            20,
                            "10:00",
                            "12:00"
                        ],
                        [
                            2023,
                            5,
                            21,
                            "09:00",
                            "10:00"
                        ],
                    ]
                }
            }
        }
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.tutorId;
            const inputYear = parseInt(req.query.year);
            const inputStartMonth = parseInt(req.query.startMonth);
            const inputEndMonth = parseInt(req.query.endMonth);
            const schedule = await TutorSchedule.aggregate([
                {
                    $match: { $expr: { $eq: ['$tutorId', { $toObjectId: id }] } }
                },
                {
                    $project: {
                        tutorId: 1,
                        routine_dayTime: 1,
                        dates: {
                            $map: {
                                input: "$dates",
                                as: "date",
                                in: {
                                    year: "$$date.year",
                                    months: {
                                        $filter: {
                                            input: "$$date.months",
                                            as: "month",
                                            cond: {
                                                $and: [
                                                    { $eq: [ "$$date.year", inputYear ] },
                                                    { $gte: [ "$$month.month", inputStartMonth ] },
                                                    { $lte: [ "$$month.month", inputEndMonth ] }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {   // 過濾資料中 dates 陣列中的元素，只留下其中的 months 陣列長度不為 0 的元素。
                    $project: {
                        tutorId: 1,
                        routine_dayTime: 1,
                        dates: { 
                            $filter: { 
                                input: "$dates", 
                                as: "date", 
                                cond: { 
                                    $ne: [ { $size: "$$date.months" }, 0 ] 
                                } 
                            } 
                        }
                    }
                }
            ]);
            // console.log(JSON.stringify(schedule[0].dates, null, 2));
            let dateData = schedule[0];
            const result = dateData.dates.reduce((aryRS, date) => {
                const year = date.year;
                date.months.forEach(month => {
                    const monthValue = month.month;
                    
                    month.days.forEach(day => {
                        const dayValue = day.day;
                        
                        day.time_slots.forEach(timeSlot => {
                            const sTime = timeSlot[0];
                            const eTime = timeSlot[1];

                            const aryV = [year, monthValue, dayValue, sTime, eTime];
                            aryRS.push(aryV);
                        })
                    })
                })

                return aryRS;
            }, []);
            if(result) {
                // 組合回傳結果
                const data = {};
                data["routine_dayTime"] = dateData.routine_dayTime;
                data["dates"] = result;
                // console.log(data);
                successHandle(res, data);
            } else {
                return next(customiError(400, "無此 ID 帳號資訊"))
            }
        } catch(err) {
            return next(err);
        }
    },
    // 修改單一教師 - 行事曆資料 (v-calendar 格式)
    async updateScheduleV(req, res, next){
        /**
         * #swagger.tags = ['TutorSchedule (v-calendar)'],
         * #swagger.description = '修改單一教師 - 行事曆資料，修改特定日期設定'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    $dates: []
                }
            }    
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.tutorId;
            const { body } = req;
            const dates = body.dates;
            const data = {};

            // 將前端傳來的陣列資料整理
            dates.forEach(entry => {
                const year = entry[0];
                const month = entry[1];
                const day = entry[2];
                const timeSet = [];
                // timeSet 格式： [startTime, endTime]
                timeSet.push(entry[3]);
                timeSet.push(entry[4]);
                console.log(timeSet);
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

                data[year].months[month].days[day].time_slots.push(timeSet);
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
                const dbYear = await TutorSchedule.findOne({
                    tutorId : id,
                    "dates.year": yearData.year});
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
                    const dbMonth = await TutorSchedule.findOne({
                        tutorId : id,
                        "dates.months.month": monthData.month});
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
                        const dbDay = await TutorSchedule.findOne({
                            tutorId : id,
                            "dates.months.days.day": dayData.day});
                        // 若資料庫無該「日期」的資料，則新增資料
                        if (!dbDay) {
                            console.log("dayData", dayData);
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
            successHandle(res, "更新時段設定資料成功");
        } catch(err) {
            return next(err);
        } 
    },
    // 刪除單一教師 - 單日時段時間設定 (v-calendar 格式)
    async deleteScheduleV(req, res, next){
        /**
         * #swagger.tags = ['TutorSchedule (v-calendar)'],
         * #swagger.description = '刪除單一教師 - 單日時段時間設定 (v-calendar 格式)'
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    $dates: []
                }
            }    
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */
        try {
            const id = req.params.tutorId;
            const { body } = req;
            const dates = body.dates[0];
            // 將 年、月、日 取出
            const year = dates[0];
            const month = dates[1];
            const day = dates[2];
            // 從「月份」中將特定日期移除
            const pullSchedule = await TutorSchedule.findOneAndUpdate(
                { "tutorId" : id },
                {
                    $pull: {
                        "dates.$[outer].months.$[inner].days": { day: day }
                    }
                },
                {
                    new: true,
                    arrayFilters: [
                        { "outer.year": year },
                        { "inner.month": month }
                    ]
                }
            );
            successHandle(res, pullSchedule);
        } catch(err) {
            return next(err);
        }
    },
    // 更新單一教師 - 常規行事曆設定（依照年度、月份區間）
    async updateRoutineScheduleV(req, res, next){
        /**
         * #swagger.tags = ['TutorSchedule (v-calendar)'],
         * #swagger.description = '更新單一教師 - 常規行事曆設定（依照年度、月份區間）
         * #swagger.parameters['body'] = {
                in : 'body',
                type : 'object',
                required : true,
                description : '資料格式',
                schema : 
                {
                    $year: 2023,
                    $month: 5,
                    $data: []
                }
            }    
         * #swagger.security = [{
            "JwtToken" : []
            }]
         */

        // 將同一星期的日期放在同一個陣列中
        async function getDatesByWeekday(year, month) {
            // O: SUN
            // 1: MON
            // 2: TUE
            // 3: WED
            // 4: THS
            // 5: FRI
            // 6: SAT

            const datesByWeekday = {
                '0': [],
                '1': [],
                '2': [],
                '3': [],
                '4': [],
                '5': [],
                '6': [],
            };
            
            const lastDayOfMonth = new Date(year, month, 0);
            
            for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
                const currentDate = new Date(year, month - 1, day);
                const weekday = currentDate.getDay().toString();
                datesByWeekday[weekday].push(day);
            }
            return datesByWeekday;
        }
        // 將同一星期的時段設定放在同一個陣列中
        async function getGroupedData(data) {
            const groupedData = data.reduce((result, item) => {
                const day = item[0];
                const timeSlot = [item[1], item[2]];
            
                if (!result[day]) {
                    result[day] = [];
                }
            
                result[day].push(timeSlot);
            
                return result;
            }, {});
            return groupedData;
        }

        // 更新 routine Time
        async function updateRoutineTime(id, routineData) {
            try {
                const updatedSchedule = await TutorSchedule.findOneAndUpdate(
                    { "tutorId" : id}, 
                    { routine_dayTime: routineData}, 
                    { new : true});
                return '更新資料成功'
            } catch(err) {
                return next(err);
            }
        }

        // 更新 或 新增資料到資料庫
        async function updateOrCreateData(id, targetYear, targetMonth, dayData, timeSlotsData) {
            try {
                // console.log(id, targetYear, targetMonth, dayData, timeSlotsData)
                // 取得今天日期的年、月、日
                const today = new Date();
                const todayYear = today.getFullYear();
                const todayMonth = today.getMonth() + 1;
                const todayDay = today.getDate();

                const tutorSchedule = await TutorSchedule.findOne({
                    tutorId: id,
                    'dates.year': targetYear,
                    'dates.months.month': targetMonth,
                });
                if (tutorSchedule) {
                    // 找到對應的 TutorSchedule 資料
                    const yearData = tutorSchedule.dates.find((year) => year.year === targetYear);
                    const monthData = yearData.months.find((month) => month.month === targetMonth);
                    dayData.forEach((day) => {
                        // 只有在今天日期之後的日期才進行更新或新增資料
                        if (
                            targetYear > todayYear ||
                            (targetYear === todayYear && targetMonth > todayMonth) ||
                            (targetYear === todayYear && targetMonth === todayMonth && day >= todayDay))
                        {
                            const existingDayData = monthData.days.find((d) => d.day === day);

                            if (existingDayData) {
                                // 更新現有的 day 資料，但僅當 flag 為 false 時更新
                                if (!existingDayData.flag) {
                                    existingDayData.time_slots = timeSlotsData;
                                }
                            } else {
                                // 新增新的 day 資料
                                monthData.days.push({
                                    day: day,
                                    time_slots: timeSlotsData,
                                    flag: false, // 預設 flag 為 false
                                });
                            }
                        }
                    });

                    await tutorSchedule.save();

                } else {
                    const today = new Date();
                    const dbYear = await TutorSchedule.findOne({
                        tutorId : id,
                        "dates.year": targetYear});
                    // 若資料庫無該「年度」的資料，則新增資料
                    if (!dbYear) {
                        const newTutorSchedule = await TutorSchedule.findOneAndUpdate(
                            {
                                tutorId: id,
                            },
                            {
                                $push: {
                                    dates: {
                                        year: targetYear,
                                        months: [
                                            {
                                                month: targetMonth,
                                                    days: dayData.map((day) => {
                                                        const currentDate = new Date(targetYear, targetMonth - 1, day);
                                                        const isAfterToday = currentDate > today;
                                                        if (isAfterToday) {
                                                        return {
                                                            day: day,
                                                            time_slots: timeSlotsData,
                                                            flag: false,
                                                        };
                                                        } else {
                                                            return null; // 或者可以返回一個特殊值，表示不滿足條件，可以在後續處理中忽略這些日期
                                                        }
                                                }).filter(Boolean)
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                new: true,
                            }
                        );
                        if (newTutorSchedule) {
                            await newTutorSchedule.save();
                        }
                    }
                    // 確認 database 中是否有該「月份」的資料
                    const dbMonth = await TutorSchedule.findOne({
                        tutorId : id,
                        "dates.months.month": targetMonth});
                    // 若資料庫無該「月份」的資料，則新增資料
                    if (!dbMonth) {
                        const newTutorSchedule = await TutorSchedule.findOneAndUpdate(
                            {
                                tutorId: id,
                                'dates.year': targetYear,
                            },
                            {
                                $push: {
                                    'dates.$[outer].months': [
                                        {
                                            month: targetMonth,
                                            days: dayData.map((day) => {
                                                const currentDate = new Date(targetYear, targetMonth - 1, day);
                                                const isAfterToday = currentDate > today;
                                                if (isAfterToday) {
                                                return {
                                                    day: day,
                                                    time_slots: timeSlotsData,
                                                    flag: false,
                                                };
                                                } else {
                                                    return null; // 或者可以返回一個特殊值，表示不滿足條件，可以在後續處理中忽略這些日期
                                                }
                                            }).filter(Boolean)
                                        },
                                    ],
                                },
                            },
                            {
                                new: true,
                                arrayFilters: [{ 'outer.year': targetYear }],
                            }
                        );
                        if (newTutorSchedule) {
                            await newTutorSchedule.save();
                        }
                    }
                }
            } catch (err) {
                return res.status(500).json({ error: err.message }); 
            }
        }
        
        // 前端傳來的資料
        // tutorId
        const id = req.params.tutorId;

        const { body } = req;
        // 年度
        const targetYear = parseInt(body.year);
        // 月份
        const targetMonth = parseInt(body.month);
        // 常規時段資料
        const data = body.data;

        // 將月份對應日期整理：
        const datesByWeekday = await getDatesByWeekday(targetYear, targetMonth);

        // 整理後的 時段 集合
        const routineData = await getGroupedData(data);
        // const routineData = {
        //     '0': [ [ '08:00', '10:00' ], [ '10:00', '12:00' ] ]}
        const aryDatesByWeekday = Object.entries(datesByWeekday);
        // const aryDatesByWeekday = [[ '0', [ 7, 14, 21, 28 ]]]

        try {
            // 更新 routine_dayTime 的資料集
            await updateRoutineTime(id, routineData);

            // 更新 整月日期 的時段資料
            for(var i=0 ; i< aryDatesByWeekday.length; i++) {
                // console.log(aryDatesByWeekday);
                const aryDate = aryDatesByWeekday[i][1];  //同星期日期集合，格式：[7, 14, 21, 28]
                const aryTimeSlot = routineData[aryDatesByWeekday[i][0]]; //同星期時段集合，格式：[ [ '09:00', '10:00' ], [ '16:00', '18:00' ] ]
                await updateOrCreateData(id, targetYear, targetMonth, aryDate, aryTimeSlot);
            }

            // 回傳結果
            successHandle(res, "更新或新增時間設定完成！");
        } catch(err) {
            return next(err);  
        }
    }   
}

module.exports = tutorScheduleController;
