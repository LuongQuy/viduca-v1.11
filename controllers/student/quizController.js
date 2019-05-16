const quizModel = require('../../models/quiz');
const resultQuizModel = require('../../models/result-quiz');
const reduceResultQuizModel = require('../../models/reduce-result-quiz');
const lessonModel = require('../../models/lesson');
const courseModel = require('../../models/course');

exports.getQuiz = (req, res) => {
    var lessonId = req.query.lessonId;
    quizModel.find({lesson: lessonId},'_id question answers', (err, quizes) => {
        return res.render('student/layouts/classroom/div-quiz', {quizes: quizes});
    });
}

exports.postSaveResultQuiz = (req, res) => {
    var studentId = req.body.studentId;
    var quizId = req.body.question;
    var answer = req.body.answer;
    var lesson = req.body.lesson;
    
    quizModel.findOne({_id: quizId}, (err, quiz) => {
        if(quiz){
            resultQuizModel.findOne({student: studentId, quiz: quizId}, (err, resultQuiz) => {
                if(!resultQuiz){
                    if(quiz.correctAnswer == answer){
                        var newResultQuiz = new resultQuizModel({
                            student: studentId,
                            quiz: quizId,
                            answer: answer,
                            lesson: lesson,
                            correct: true
                        });
                        newResultQuiz.save();
                        return res.send('1');
                    }
                    else{
                        var newResultQuiz = new resultQuizModel({
                            student: studentId,
                            quiz: quizId,
                            answer: answer,
                            lesson: lesson,
                            correct: false
                        });
                        newResultQuiz.save();
                        return res.send('0');
                    }
                }else{
                    if(quiz.correctAnswer == answer) return res.send('1');
                    else return res.send('0');
                }
            })
        }
        else return res.send('0');
    })
}

exports.postSaveReduceResultQuiz = (req, res) => {
    var lessonId = req.body.lesson;
    var studentId = req.body.studentId;
    var resultQuiz = req.body.resultQuiz;
    quizModel.count({lesson: lessonId}, (err, cntQuiz) => {
        resultQuiz += '/' + cntQuiz;
        reduceResultQuizModel.findOne({lesson: lessonId, student: studentId}, (err, reduce) => {
            if(!reduce){
                lessonModel.findOne({_id: lessonId}, (err, lesson) => {
                    var newResult = new reduceResultQuizModel({
                        lesson: lessonId,
                        student: studentId,
                        result: resultQuiz,
                        course: lesson.course
                    })
            
                    newResult.save((err, result) => {
            
                    })
                })
                
            }else{
                // reduceResultQuizModel.findOneAndUpdate({lesson: lessonId, student: studentId}, {
                //     result: resultQuiz
                // }, (err, result) => {})
            }
        })
    })
}