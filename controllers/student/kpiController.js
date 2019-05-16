const kpiStudentModel = require('../../models/kpi_student');
const courseModel = require('../../models/course');
const lessonModel = require('../../models/lesson');
const quizModel = require('../../models/quiz');
const resultQuizModel = require('../../models/result-quiz');
const ReduceResultQuizModel = require('../../models/reduce-result-quiz');


exports.getKPI = (req, res) => {
    var courseId = req.query.courseId;
    courseModel.find({'learner': req.user._id}, (err, courses) => {
        lessonModel.count({'participant': req.user._id}, (err, cntLesson) => {
            quizModel.count({'student': req.user._id}, (err, cntQuiz) => {
                kpiStudentModel.findOne({course: courseId}, (err, kpi) => {
                    if(kpi){
                        lessonModel.count({course: courseId}, (err, cntTotalLesson) => {
                            var rate_lesson_attend = cntLesson/cntTotalLesson;
                            resultQuizModel.count({'student': req.user._id, 'correct': true}, (err, cntCorrectQuiz) => {
                                var rate_quiz_correct = cntCorrectQuiz/cntQuiz;

                                ReduceResultQuizModel.find({course: courseId, student: req.user._id}, (err, reduces) => {
                                    return res.render('student/kpi/index', {sumOfCourse: courses.length, sumOfLesson: cntLesson, 
                                        sumOfQuiz: cntQuiz, courses: courses, currentCourse: courseId, rate_of_lesson: kpi.rate_of_lesson,
                                        rate_of_quiz: kpi.rate_of_quiz, rate_lesson_attend: rate_lesson_attend,
                                        rate_quiz_correct: rate_quiz_correct,
                                        reduces: reduces,
                                        cntTotalLesson: cntTotalLesson
                                        });
                                })

                                    
                            })
                                
                        })

                    }else{
                        return res.render('student/kpi/index', {sumOfCourse: courses.length, sumOfLesson: cntLesson, 
                            sumOfQuiz: cntQuiz, courses: courses, currentCourse: 0, rate_of_lesson: 0, rate_of_quiz: 0,
                            rate_lesson_attend: 0, rate_quiz_correct: 0
                        });
                    }
                    
                })
                
            })
        })
    })
}

exports.getKPIAjax = (req, res) => {
    var courseId = req.query.courseId;
    courseModel.find({'learner': req.user._id}, (err, courses) => {
        lessonModel.count({'participant': req.user._id}, (err, cntLesson) => {
            quizModel.count({'student': req.user._id}, (err, cntQuiz) => {
                kpiStudentModel.findOne({course: courseId}, (err, kpi) => {
                    if(kpi){
                        lessonModel.count({course: courseId}, (err, cntTotalLesson) => {
                            var rate_lesson_attend = cntLesson/cntTotalLesson;
                            // rate_lesson_attend = 0;
                            resultQuizModel.count({'student': req.user._id, 'correct': true}, (err, cntCorrectQuiz) => {
                                var rate_quiz_correct = cntCorrectQuiz/cntQuiz;
                                ReduceResultQuizModel.find({course: courseId, student: req.user._id}, (err, reduces) => {
                                    return res.json({sumOfCourse: courses.length, sumOfLesson: cntLesson, 
                                        sumOfQuiz: cntQuiz, courses: courses, currentCourse: 0, rate_of_lesson: kpi.rate_of_lesson,
                                        rate_of_quiz: kpi.rate_of_quiz, rate_lesson_attend: rate_lesson_attend,
                                        rate_quiz_correct: rate_quiz_correct,
                                        reduces: reduces
                                        });
                                    });
                            })
                        })

                    }else{
                        return res.json({sumOfCourse: courses.length, sumOfLesson: cntLesson, 
                            sumOfQuiz: cntQuiz, courses: courses, currentCourse: 0, rate_of_lesson: 0, rate_of_quiz: 0,
                            rate_lesson_attend: 0, rate_quiz_correct: 0
                        });
                    }
                    
                })
                
            })
        })
    })
}