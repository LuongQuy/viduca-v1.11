const courseModel = require('../../models/course');
const libary = require('../library');

exports.getCourses = (req, res) => {
    courseModel.find({}, (err, courses) => {
        res.render('student/courses', {title: 'Tất cả khóa học', courses: courses, username: libary.getCurrentUser(req.user) });
    });
}

exports.getMyCourses = (req, res) => {
    courseModel.find({learner: req.user._id}, (err, courses) => {
        res.render('student/courses', {title: 'Khóa học bạn đã đăng ký', courses: courses, username: libary.getCurrentUser(req.user) });
    });
}

exports.getCourseDetail = (req, res) => {
    courseModel.findOne({ _id: req.query.courseId }).populate('instructor').exec((err, course) => {
        if (course) {
            var boolRegister = true;
            if(course.learner.toString().includes(req.user._id)){ boolRegister = false };
            res.render('student/course-detail', { course: course, boolRegister: boolRegister, username: libary.getCurrentUser(req.user) });
        }
    });
}

exports.getRegisterCourse = (req, res) => {
    courseModel.findByIdAndUpdate(req.query.courseId, {$push: {learner: req.user._id}} ,(err, course) => {
        res.redirect('/student/course-detail?courseId=' + req.query.courseId);
    });
}

exports.getQuitCourse = (req, res) => {
    courseModel.findByIdAndUpdate(req.query.courseId, {$pull: {learner: req.user._id}}, (err, course) => {
        return res.redirect('/student/course-detail?courseId=' + req.query.courseId);
    });
}