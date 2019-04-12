const moment = require('moment');
const OpenVidu = require('openvidu-node-client').OpenVidu;
// const OV = new OpenVidu('https://207.148.109.204:4443/', 'YOUR_SECRET');
const OV = new OpenVidu('localhost:4443', 'MY_SECRET');
const courseModel = require('../models/course');
const lessonModel = require('../models/lesson');
const library = require('./library');
var mapSessions = {};
var mapSessionNamesTokens = {};

exports.getClassroom = (req, res, next) => {
    lessonModel.findById(req.query.lessonId).populate('course').exec((err, lesson) => {
        if (lesson) {
            const room = req.query.lessonId;
            if (req.user.role == 'STUDENT' && lesson.course.learner.toString().includes(req.user._id)) {
                if (mapSessions[room]) {
                    var mySession = mapSessions[room];
                    mySession.generateToken()
                        .then(token => {
                            mapSessionNamesTokens[room].push(token);
                            res.render('student/classroom', {
                                token: token,
                                username: library.getCurrentUser(req.user),
                                lessonId: req.query.lessonId,
                                userId: req.user._id,
                                role: req.user.role
                            });
                        })
                        .catch(err => console.log(err));
                } else {
                    res.send('Giáo viên chưa vào lớp, bạn vui lòng đợi!');
                }

            } else if (req.user.role == 'INSTRUCTOR' && req.user._id.equals(lesson.instructor)) {
                OV.createSession()
                    .then(session => {
                        mapSessions[room] = session;
                        mapSessionNamesTokens[room] = [];
                        session.generateToken()
                            .then(token => {
                                mapSessionNamesTokens[room].push(token);
                                res.render('instructor/classroom', {
                                    token: token,
                                    username: library.getCurrentUser(req.user),
                                    lessonId: req.query.lessonId,
                                    userId: req.user._id,
                                    role: req.user.role
                                });
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            } else {
                return res.send('Bạn không có quyền tham gia lớp học này, vui lòng quay trở lại!');
            }
        } else {
            return res.send('Buổi học không tồn tại, vui lòng quay trở lại.');
        }
    });
}


exports.postLeaveSession = (req, res) => {
    var lessonId = req.body.lessonId;
    var token = req.body.token;
    console.log(lessonId);
    console.log(token);
    process.exit(1);
}