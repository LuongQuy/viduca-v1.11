const moment = require('moment');
const OpenVidu = require('openvidu-node-client').OpenVidu;
// const OV = new OpenVidu('https://45.32.99.33:4443', 'MY_SECRET');
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
                if (lesson.participants.findIndex((participant) => {
                    return (req.user._id.equals(participant.student));
                }) === -1) {
                    lesson.update({
                        $push: {
                            participants: {
                                student: req.user._id,
                                join_time: Date.now()
                            }
                        }
                    }).exec();
                }

                if (mapSessions[room]) {
                    var mySession = mapSessions[room];
                    mySession.generateToken()
                        .then(token => {
                            mapSessionNamesTokens[room].push(token);
                            res.render('student/classroom', {
                                token: token,
                                username: library.getCurrentUser(req.user)
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
                                    username: library.getCurrentUser(req.user)
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