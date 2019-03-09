var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
    name: String,
    description: String,
    content: String,
    instructor: {type: Schema.Types.ObjectId, ref: 'User'},
    avatar: String,
    documents: Array,
    learner: [{type: Schema.Types.ObjectId, ref: 'User'}],
    session: Schema.Types.Mixed,
    approved: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);