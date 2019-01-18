const courseModel = require('../../models/course');
const lessonModel = require('../../models/lesson');
const library = require('../library');

exports.getShowLessonList = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if(course){
            if(course.learner.toString().includes(req.user._id)){
                lessonModel.find({course: req.query.courseId}, (err, lessons) => {
                    return res.render('student/show-lesson-list', {lessons: lessons, course: course, boolRegister: false, username: library.getCurrentUser(req.user)});
                });                
            }else{
                return res.send('Bạn chưa đăng ký khóa học này nên không thể xem danh sách khóa học, vui lòng quay trở lại và đăng ký.');
            }
        }else{
            return res.send('Khóa học này không tồn tại, vui lòng quay trở lại.');
        }
    });    
}

exports.getLessonDetail = (req, res) => {
    lessonModel.findById(req.query.lessonId, (err, lesson) => {
        if(lesson){
            courseModel.findById(lesson.course, (err, course) => {
                if(course.learner.toString().includes(req.user._id)){
                    return res.render('student/lesson-detail', {lesson: lesson, course: course, boolRegister: false, username: library.getCurrentUser(req.user)});             
                }else{
                    return res.send('Bạn chưa đăng ký khóa học này nên không thể xem thông tin buổi học này, vui lòng quay trở lại và đăng ký.');
                }
            });
        }else{
            return res.send('Buổi học này không tồn tại, vui lòng quay trở lại.');
        }
    });    
}