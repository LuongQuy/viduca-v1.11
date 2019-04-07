const courseModel = require('../../models/course');
const libary = require('../library');

exports.getCourses = (req, res) => {
    courseModel.find({approved: true}, (err, courses) => {
        res.render('student/courses', {title: 'Tất cả khóa học', courses: courses, username: libary.getCurrentUser(req.user) });
    });
}

exports.getMyCourses = (req, res) => {
    courseModel.find({learner: req.user._id, approved: true}, (err, courses) => {
        res.render('student/courses', {title: 'Khóa học bạn đã đăng ký', courses: courses, username: libary.getCurrentUser(req.user) });
    });
}

exports.getCourseDetail = (req, res) => {
    courseModel.findOne({ _id: req.query.courseId, approved: true }).populate('instructor').exec((err, course) => {
        if (course) {
            var boolRegister = true;
            if(course.learner.toString().includes(req.user._id)){ boolRegister = false };
            res.render('student/course-detail', { course: course, boolRegister: boolRegister, username: libary.getCurrentUser(req.user) });
        }
    });
}

exports.getRegisterCourse = (req, res) => {
    courseModel.findById(req.query.courseId, course => {
        // if(course.password ==)
    });
    courseModel.findByIdAndUpdate(req.query.courseId, {$push: {learner: req.user._id}} ,(err, course) => {
        res.redirect('/student/course-detail?courseId=' + req.query.courseId);
    });
}

exports.postJoinInCourse = (req, res) => {
    var courseId = req.query.courseId;
    var password = req.body.passwordOfCourse;
    courseModel.findOne({ _id: courseId, approved: true }).populate('instructor').exec((err, course) => {
        if(course.password == req.body.passwordOfCourse){
            courseModel.findByIdAndUpdate(req.query.courseId, {$push: {learner: req.user._id}}).populate("instructor").exec((err, course1) => {
                var boolRegister = true;
                if(course1.learner.toString().includes(req.user._id)){ boolRegister = false };
                return res.render('student/course-detail', { course: course, boolRegister: boolRegister, username: libary.getCurrentUser(req.user), msg: "Đăng ký khóa học thành công."});
            });
        }else{
            var boolRegister = true;
            if(course.learner.toString().includes(req.user._id)){ boolRegister = false };
            return res.render('student/course-detail', { course: course, boolRegister: boolRegister, username: libary.getCurrentUser(req.user), msg: "Mật khẩu khóa học sai, vui lòng xem lại."});
        }
        
    });
}

exports.getQuitCourse = (req, res) => {
    courseModel.findByIdAndUpdate(req.query.courseId, {$pull: {learner: req.user._id}}, (err, course) => {
        return res.redirect('/student/course-detail?courseId=' + req.query.courseId);
    });
}