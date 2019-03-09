const courseModel = require('../../models/course');
const library = require('../library');

exports.getShowCourseList = (req, res) => {
    courseModel.find({}).populate('instructor').exec( (err, courses) => {
        res.render('admin/manage-course/show-course-list', {courses: courses, username: library.getCurrentUser(req.user)});
    });
}

exports.getDeleteCourse = (req, res) => {
    var courseId = req.query.courseId;
    
        courseModel.findByIdAndRemove(courseId, (err, course) => {
            if(course){
                courseModel.find({}).populate('instuctor').exec((err, courses) => {
                   return res.render('admin/manage-course/show-course-list', {msg:'Xóa khóa học ' + course.name + ' thành công.' , courses: courses, username: library.getCurrentUser(req.user)});
                });
            }else{
                return res.send('Xóa khóa học thất bại, vui lòng thử lại sau.');
            }
    });
}

exports.getAppoveCourse = (req, res) => {
    var courseId = req.query.courseId;
    var status;
    if(req.query.status === 'false')
        status = true;
    else status = false;
        courseModel.findByIdAndUpdate(courseId, {'approved': status}, (err, course) => {
            if(course){
                courseModel.find({}).populate('instructor').exec( (err, courses) => {
                    if(status)
                        return res.render('admin/manage-course/show-course-list', {msg:'Phê duyệt khóa học ' + course.name + ' thành công.' , courses: courses, username: library.getCurrentUser(req.user)});
                    else return res.render('admin/manage-course/show-course-list', {msg:'Hủy phê duyệt khóa học ' + course.name + ' thành công.' , courses: courses, username: library.getCurrentUser(req.user)});
                });
            }else{
                return res.send('Phê duyệt khóa học thất bại, vui lòng thử lại sau.');
            }
    });
}
