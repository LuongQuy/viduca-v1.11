var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultQuizSchema = new Schema({
    student: {type: Schema.Types.ObjectId, ref: 'User'},
    quiz: {type: Schema.Types.ObjectId, ref: 'Quiz'},
    lesson: {type: Schema.Types.ObjectId, ref: 'Lesson'},
    answer: String,
    correct: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('ResultQuiz', resultQuizSchema);