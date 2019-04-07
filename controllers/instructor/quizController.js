const library = require('../library');
const quizModel = require('../../models/quiz');
const resultQuizModel = require('../../models/result-quiz');
const courseModel = require('../../models/course');
const lessonModel = require('../../models/lesson');

exports.getCreateNewQuiz = (req, res) => {
    return res.render('instructor/quiz/create-new-quiz', {username: library.getCurrentUser(req.user), lessonId: req.query.lessonId});
}

exports.postCreateNewQuiz = (req, res) => {
    var lessonId = req.query.lessonId;
    var question = req.body.question;
    var answers = JSON.parse(req.body.answer);
    var correctAnswer = req.body.correctAnswer

    if(question != ''){
        var newQuiz = new quizModel({
            lesson: lessonId,
            question: question,
            correctAnswer: correctAnswer
        });
        newQuiz.save((err, newquiz) => {
            var i = 0;
            answers.forEach(element => {
                quizModel.findByIdAndUpdate(newquiz._id, {$push: {answers: {content: element, id: ++i}}}, (err, quiz) => {});
            });
            return res.json({msg: 'Thêm quiz thành công'});
        });
    }else{
        return res.json({msg: 'Câu hỏi không được bỏ trống'});
    }
}

exports.getQuiz = (req, res) => {
    var lessonId = req.query.lessonId;
    quizModel.find({lesson: lessonId},'_id question answers', (err, quizes) => {
        return res.render('instructor/layouts/classroom/div-quiz', {quizes: quizes});
    });
}


exports.getResultQuiz = (req, res) => {
    var lessonId = req.query.lessonId;
    lessonModel.findOne({_id: lessonId}).populate('course').exec((err, lesson) => {
        courseModel.findOne({_id: lesson.course}).populate('learner').exec((err, course) => {
            var resultOfStudent = [];
            course.learner.forEach(student => {
                resultQuizModel.find({student: student._id, lesson: lessonId}, (err, resultQuizes) => {
                    resultOfStudent[student.local.email] = 0;
                    resultQuizes.forEach(resultQuiz => {
                        if(resultQuiz.correct == true){
                            resultOfStudent[student.local.email] += 1;
                        }
                    })
                })
            });
            quizModel.find({lesson: lessonId}).exec((err, quizes) => {
                return res.render('instructor/show-result-quiz', {resultOfStudent: resultOfStudent, totalQuiz: quizes.length, username: library.getCurrentUser(req.user), lesson: lesson})
            })  
        });
    });
}

exports.getResultQuizClassroom = (req, res) => {
    var lessonId = req.query.lessonId;
    lessonModel.findOne({_id: lessonId}).populate('course').exec((err, lesson) => {
        courseModel.findOne({_id: lesson.course}).populate('learner').exec((err, course) => {
            var resultOfStudent = [];
            course.learner.forEach(student => {
                resultQuizModel.find({student: student._id, lesson: lessonId}, (err, resultQuizes) => {
                    resultOfStudent[student.local.email] = 0;
                    resultQuizes.forEach(resultQuiz => {
                        if(resultQuiz.correct == true){
                            resultOfStudent[student.local.email] += 1;
                        }
                    })
                })
            });
            quizModel.find({lesson: lessonId}).exec((err, quizes) => {
                return res.render('instructor/get-result-quiz-classroom', {resultOfStudent: resultOfStudent, totalQuiz: quizes.length, username: library.getCurrentUser(req.user), lesson: lesson})
            })  
        });
    });
}