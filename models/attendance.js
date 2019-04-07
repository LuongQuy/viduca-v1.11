var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    lesson: {type: Schema.Types.ObjectId, ref: 'Lesson'},
    student: {type: Schema.Types.ObjectId, ref: 'User'},
    time_attend: [{
        join_time: String,
        exit_time: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);