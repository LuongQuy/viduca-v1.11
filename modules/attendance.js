const attendanceModel = require('../models/attendance');
const userModel = require('../models/user');
const lessonModel = require('../models/lesson');

exports.attendance = (server) => {
    var io = require('socket.io').listen(server);
    io.on('connection', socket =>{
        socket.emit('request information for attendane', {});
        socket.on('send information for attendance', event => {
            var studentId = event.userId;
            var lessonId = event.lessonId;
            var role = event.role;
            socket.studentId = studentId;
            socket.lessonId = lessonId;
            socket.role = role;

            if(role == 'STUDENT'){
                attendanceModel.findOne({student: studentId, lesson: lessonId}, (err, attendance) => {
                    if(attendance){
                        attendanceModel.findOneAndUpdate({_id: attendance._id}, {$push:{time_attend: {
                            join_time: getTime(),
                            exit_time: '0'
                        }}}, (err, att) => {
                            if(err) console.log(err.toString());
                        });
                    }else{
                            lessonModel.findOneAndUpdate({_id: lessonId}, {$push: {participant: studentId}}, (err, lesson) => {});
                            var attendance = new attendanceModel({
                            lesson: lessonId,
                            student: studentId,
                            time_attend: {join_time: getTime(), exit_time: '0'}
                        });
                        attendance.save((err, attendance) => {socket.attId = attendance.time_attend._id});
                    }
                });
            }
        });
        socket.on('disconnect', event=>{
            if(socket.role == 'STUDENT'){
                attendanceModel.findOne({lesson: socket.lessonId, student: socket.studentId}, (err, attendance) => {
                    var attLen = attendance.time_attend.length;
                    attendanceModel.update({_id: attendance._id, 'time_attend.exit_time': '0'}, {'time_attend.$.exit_time': getTime()}, (err, att1) => {});
                })
            }
        });
    });
}

function getTime(){
    var currentTime = new Date();
    return  (currentTime.getHours() + ' giờ ' + currentTime.getMinutes() + ' phút ' + ' Ngày ' + 
            currentTime.getDate() + ' - ' +
            parseInt(currentTime.getMonth()+1) + ' - ' + currentTime.getFullYear());
}