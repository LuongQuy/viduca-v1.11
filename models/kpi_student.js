var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KPIStudentSchema = new Schema({
    instructor: {type: Schema.Types.ObjectId, ref: 'User'},
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    rate_of_lesson: Number,
    rate_of_quiz: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('KPIStudent', KPIStudentSchema);