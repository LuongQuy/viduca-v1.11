var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reduceResultQuizSchema = new Schema({
    student: {type: Schema.Types.ObjectId, ref: 'User'},
    lesson: {type: Schema.Types.ObjectId, ref: 'Lesson'},
    result: String,
    course: {type: Schema.Types.ObjectId, ref: 'Course'}
}, {
    timestamps: true
});

module.exports = mongoose.model('ReduceResultQuiz', reduceResultQuizSchema);