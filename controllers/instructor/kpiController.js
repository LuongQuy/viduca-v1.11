const library = require('../library');
const userModel = require('../../models/user');
const courseModel = require('../../models/course');
const lessonModel = require('../../models/lesson');
const quizModel = require('../../models/quiz');
const KPIInstructorModel = require('../../models/kpi_instructor');
const KPIStudentModel = require('../../models/kpi_student');
const ReduceResultQuizModel = require('../../models/reduce-result-quiz');

exports.getIndex = (req, res) => {
    var userId = req.user._id;
    courseModel.count({instructor: userId},(err, sumOfCourse) => {
        lessonModel.count({instructor: userId},(err, sumOfLesson) => {
            quizModel.count({instructor: userId}, (err, sumOfQuiz) => {
                KPIInstructorModel.findOne({instructor: userId}, (err, kpi) => {
                    if(kpi){
                        return res.render('instructor/kpi/index', {courseKpi: kpi.number_of_course, lessonKpi: kpi.number_of_lesson, quizKpi: kpi.number_of_quiz, sumOfCourse: sumOfCourse, sumOfLesson: sumOfLesson, sumOfQuiz: sumOfQuiz, username: library.getCurrentUser(req.user)});
                    }
                    else{
                        return res.render('instructor/kpi/index', {courseKpi: 0, lessonKpi: 0, quizKpi: 0, sumOfCourse: sumOfCourse, sumOfLesson: sumOfLesson, sumOfQuiz: sumOfQuiz, username: library.getCurrentUser(req.user)});
                    }
                });
            });
        });
    });
}

exports.getCourseList = (req, res) => {
    return res.render('instructor/kpi/course-list', {username: library.getCurrentUser(req.user)});
}

exports.getSetupKPIInstructor = (req, res) => {
    KPIInstructorModel.findOne({instructor: req.user._id}, (err, kpi) => {
        if(kpi){
            return res.render('instructor/kpi/setup-kpi-instructor', {number_of_course: kpi.number_of_course, number_of_lesson: kpi.number_of_lesson, number_of_quiz: kpi.number_of_quiz, username: library.getCurrentUser(req.user)});
        }else{
            return res.render('instructor/kpi/setup-kpi-instructor', {number_of_course: 0, number_of_lesson: 0, number_of_quiz: 0, username: library.getCurrentUser(req.user)});
        }
    });
}

exports.postSetupKPIInstructor = (req, res) => {
    var numberOfCourse = req.body.number_of_course;
    var numberOfLesson = req.body.number_of_lesson;
    var numberOfQuiz = req.body.number_of_quiz;
    //var numberOfStudent = req.body.number_of_student;

    KPIInstructorModel.findOne({instructor: req.user._id}, (err, kpi) => {
        if(kpi){
            KPIInstructorModel.findOneAndUpdate({instructor: req.user._id}, {
                number_of_course: numberOfCourse,
                number_of_lesson: numberOfLesson,
                number_of_quiz: numberOfQuiz
                //number_of_student: numberOfStudent
            }, (err, kpiUpdated) => {
                KPIInstructorModel.findOne({instructor: req.user._id}, (err, kpi) => {
                    return res.render('instructor/kpi/setup-kpi-instructor', {number_of_course: kpi.number_of_course, number_of_lesson: kpi.number_of_lesson, number_of_quiz: kpi.number_of_quiz, username: library.getCurrentUser(req.user)});
                });
            });
        }else{
            var newKPIIntructor = KPIInstructorModel({
                instructor: req.user._id,
                number_of_course: numberOfCourse,
                number_of_lesson: numberOfLesson,
                number_of_quiz: numberOfQuiz
               // number_of_student: numberOfStudent
            });
        
            newKPIIntructor.save((err, kpi) => {
                return res.render('instructor/kpi/setup-kpi-instructor', {number_of_course: 0, number_of_lesson: 0, number_of_quiz: 0, username: library.getCurrentUser(req.user)});
            });
        }
    });
}

exports.getSetupKPIStudent = (req, res) => {
    var courseId = req.query.courseId;
    courseModel.find({instructor: req.user._id}, "name", (err, courses) => {
        if(courseId != '0'){
            KPIStudentModel.findOne({course: courseId}, (err, kpi) => {
                // return res.json(kpi);
                return res.render('instructor/kpi/setup-kpi-student', {currentCourse: courseId, rate_of_lesson: kpi.rate_of_lesson, rate_of_quiz: kpi.rate_of_quiz, courses: courses, username: library.getCurrentUser(req.user)});
            });
        }else{
            return res.render('instructor/kpi/setup-kpi-student', {currentCourse: 0, rate_of_lesson: 0, rate_of_quiz: 0, courses: courses, username: library.getCurrentUser(req.user)});
        }
        
    });
}

exports.getSetupKPIStudentAjax = (req, res) => {
    var courseId = req.query.courseId;
    courseModel.find({instructor: req.user._id}, "name", (err, courses) => {
        if(courseId != '0'){
            KPIStudentModel.findOne({course: courseId}, (err, kpi) => {
                if(kpi){
                    return res.json({rate_of_lesson: kpi.rate_of_lesson, rate_of_quiz: kpi.rate_of_quiz});
                }else{
                    return res.json({rate_of_lesson: 0, rate_of_quiz: 0});
                }
            });
        }else{
            return res.json({rate_of_lesson: 0, rate_of_quiz: 0});
        }
        
    });
}

exports.postSetupKPIStudent = (req, res) => {
    var courseId = req.body.courseId;
    // var numberOfCourse = req.body.number_of_course;
    var rateOfLesson = req.body.rate_of_lesson;
    var rateOfQuiz = req.body.rate_of_quiz;
    // var numberOfStudent = req.body.number_of_student;

    courseModel.findOne({_id: courseId}, (err, course) => {
        if(course){
            KPIStudentModel.findOne({course: courseId}, (err, kpi) => {
                if(kpi){
                    KPIStudentModel.findOneAndUpdate({course: courseId}, {
                        rate_of_lesson: rateOfLesson,
                        rate_of_quiz: rateOfQuiz
                    }, (err, kpi) => {
                        return res.redirect('/instructor/kpi/setup-kpi-student?courseId='+courseId)
                    });
                }else{
                    // return res.send('oj')
                    var newKPIStudentModel = new KPIStudentModel({
                        course: courseId,
                        rate_of_lesson: rateOfLesson,
                        rate_of_quiz: rateOfQuiz
                    });
                    newKPIStudentModel.save((err, kpi) => {
                        return res.redirect('/instructor/kpi/setup-kpi-student?courseId='+kpi.course)
                    })
                }
            });
        }else{
            return res.redirect('/instructor/kpi/setup-kpi-student?courseId=0');
        }
    })
}

exports.getShowKPIStudent = (req, res) => {
    var courseId = req.query.courseId;
    
    courseModel.findOne({_id: courseId}, 'learner instructor').populate('learner').exec(
        (err, course) => {
            courseModel.find({instructor: req.user._id}, (err, courses) => {
                if(course){
                    if(JSON.stringify(course.instructor) == JSON.stringify(req.user._id)){                
                        return res.render('instructor/kpi/show-kpi-student', {currentCourse: courseId, course: course, courses: courses});               
                    }else{
                        return res.render('instructor/kpi/show-kpi-student', {currentCourse: courseId});    
                    }
                }else{
                    return res.render('instructor/kpi/show-kpi-student', {currentCourse: courseId, courses: courses});
                }
            });
        }
    )
}

exports.getDetailKPIStudent = (req, res) => {
    var studentId = req.query.studentId;
    var courseId = req.query.courseId;

    userModel.findOne({_id: studentId}, (err, student) => {
        if(student){
            courseModel.findOne({_id: courseId}, (err, course) => {
                if(course){
                    courseModel.findOne({_id: courseId}, (err, course) => {
                        lessonModel.count({'course': courseId, 'participant': studentId}, (err, cntLessonAttend) => {
                            lessonModel.count({'course': courseId}, (err, cntTotalLesson) => {
                                quizModel.count({'student': studentId, 'correct': true}, (err, cntCorrectQuiz) => {
                                    quizModel.count({'student': studentId}, (err, cntTotalQuiz) => {

                                        ReduceResultQuizModel.find({course: courseId, student: studentId}, (err, reduces) => {
                                            return res.render('instructor/kpi/show-detail-kpi-student', {
                                                cntLessonAttend: cntLessonAttend,
                                                cntTotalLesson: cntTotalLesson,
                                                cntCorrectQuiz: cntCorrectQuiz,
                                                cntTotalQuiz: cntTotalQuiz,
                                                course: course,
                                                student: student,
                                                reduces: reduces,
                                                cntTotalLesson: cntTotalLesson
                                            });
                                        });
                                    })
                                })
                            })
                        })
                    })
                    
                }else{
                    return res.send('Không tồn tại khóa học này, vui lòng quay trở lại.');
                }
            })
        }else{
            return res.send('Không tồn tại sinh viên này, vui lòng quay trở lại.');
        }
    })
}