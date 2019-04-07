var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lessonSchema = new Schema({
    name: String, 
    content: String,
    date: String,
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    participants: [{student: {type: Schema.Types.ObjectId, ref: 'User'}, join_time: Date}],
    slides: [{name: String, url: String}],
    documents: [{name: String, url: String}],
    instructor: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);