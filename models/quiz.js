var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
    lesson: {type: Schema.Types.ObjectId, ref: 'Lesson'},
    instructor: {type: Schema.Types.ObjectId, ref: 'User'},
    question: String, 
    answers: [{content: String, id: Number}],
    correctAnswer: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);