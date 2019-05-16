var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KPIInstructorSchema = new Schema({
    instructor: {type: Schema.Types.ObjectId, ref: 'User'},
    number_of_course: Number,
    number_of_lesson: Number,
    number_of_quiz: Number,
    number_of_student: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('KPIInstructor', KPIInstructorSchema);