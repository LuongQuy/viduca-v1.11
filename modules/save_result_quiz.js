const userModel = require('../models/user');
const lessonModel = require('../models/lesson');

exports.save_result_quiz = (server) => {
    var io = require('socket.io').listen(server);
    io.on('connection', socket =>{
        socket.on('save result quiz', event => {
            var lessonId = event.lessonId;
            // lessonModel.
        });
    });
}
