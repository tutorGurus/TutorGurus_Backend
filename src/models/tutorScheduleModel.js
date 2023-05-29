const mongoose = require('mongoose');
const { Schema } = mongoose;

// 定義 timeSlotSchema - 當日時段
// const timeSlotSchema = new Schema({
//     start_time: {
//         type: String,
//         required: true
//     },
//     end_time: {
//         type: String,
//         required: true
//     },
// });

// 定義 daySchema - 日期
const daySchema = new Schema({
    day: {
        type: Number,
        required: true
    },
    time_slots: []
    ,
    flag: { // 判斷是否單日設定; true: 手動設定過時段，無法透過 routine 更新; flase: 可透過 routine 更新
        type: Boolean,
        default: false
    }
});

// 定義 monthSchema - 月份
const monthSchema = new Schema({
    month: {
        type: Number,
        required: true
    },
    days: [daySchema]
});

// 定義 yearSchema - 年份
const yearSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
    months: [monthSchema]
});

// 定義 routineTimeSchema - 常規時段設定
// O: SUN
// 1: MON
// 2: TUE
// 3: WED
// 4: THS
// 5: FRI
// 6: SAT
const routineTimeSchema = new Schema({
    "0": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": []
});

// 定義 dateSetSchema - 行事曆設定
const scheduleSchema = new Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    routine_dayTime: routineTimeSchema,
    dates: [yearSchema]
});

// 建立 TutorSchedule 實例
const TutorSchedule = mongoose.model('TutorSchedule', scheduleSchema);

module.exports = TutorSchedule;