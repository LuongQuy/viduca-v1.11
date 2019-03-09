const fs = require('fs');
const formidable = require('formidable');

const courseModel = require('../../models/course');
const lessonModel = require('../../models/lesson');
const libary = require('../library');

exports.getCourses = (req, res) => {
    courseModel.find({approved: true}, (err, courses) => {
        res.render('instructor/courses', { title: 'Tất cả khóa học', courses: courses, username: libary.getCurrentUser(req.user) });
    });
}

exports.getMyCourses = (req, res) => {
    courseModel.find({ instructor: req.user._id, approved: true }, (err, courses) => {
        res.render('instructor/courses', { title: 'Khóa học bạn đã tạo', courses: courses, username: libary.getCurrentUser(req.user) });
    });
}

exports.getCreateNewCourse = (req, res) => {
    res.render('instructor/create-new-course', { username: libary.getCurrentUser(req.user) });
}

exports.postCreateNewCourse = (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = 'public/course-avatars/';
    form.parse(req, (err, fields, file) => {
        if (file.avatar.size != 0) {
            const oldPath = file.avatar.path;
            const savePath = '/course-avatars/' + Date.now() + '-' + file.avatar.name;
            const newPath = 'public' + savePath;
            fs.rename(oldPath, newPath, err => {
                if (!err) {
                    var newCourse = new courseModel({
                        name: fields.name,
                        description: fields.description,
                        content: fields.content,
                        avatar: savePath,
                        instructor: req.user._id,
                        approved: false
                    });
                    newCourse.save((err, course) => {
                        return res.render('instructor/create-new-course', { createNewCourseMessage: 'Tạo khóa học mới thành công.', username: libary.getCurrentUser(req.user) });
                    });
                } else {
                    res.send('Tạo khóa học mới thất bại. Bạn vui lòng tạo lại khóa học.' + err)
                }
            })
        } else {
            var newCourse = new courseModel({
                name: fields.name,
                description: fields.description,
                content: fields.content,
                instructor: req.user._id,
                approved: false
            });
            newCourse.save((err, course) => {
                return res.render('instructor/create-new-course', { createNewCourseMessage: 'Tạo khóa học thành công.', username: libary.getCurrentUser(req.user) })
            })
        };
    });
}

exports.getEditCourse = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if(course){
            if (course.approved == true) {
                if (req.user._id.equals(course.instructor)) {
                    res.render('instructor/edit-course', { course: course, username: libary.getCurrentUser(req.user) });
                } else {
                    res.send('Bạn không có quyền chỉnh sửa khóa học này.')
                }
            } else {
                return res.send('Khóa học này chưa được quản trị viên phê duyệt.');
            }
        }
        else{
            return res.send('Không tồn tại khóa học này, vui lòng quay trở lại.');
        }
    });
}

exports.postEditCourse = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if (course) {
            if (req.user._id.equals(course.instructor)) {
                const form = new formidable.IncomingForm();
                form.uploadDir = 'public/course-avatars/';
                form.parse(req, (err, fields, file) => {
                    if (file.avatar.size != 0) {
                        const oldPath = file.avatar.path;
                        const savePath = '/course-avatars/' + Date.now() + '-' + file.avatar.name;
                        const newPath = 'public' + savePath;
                        fs.rename(oldPath, newPath, err => {
                            if (!err) {
                                courseModel.findByIdAndUpdate(req.query.courseId, {
                                    name: fields.name,
                                    description: fields.description,
                                    content: fields.content,
                                    avatar: savePath,
                                }, (err, course) => {
                                    courseModel.findById(req.query.courseId, (err, course) => {
                                        return res.render('instructor/edit-course', { course: course, editCourseMessage: 'Cập nhật thông tin khóa học thành công.', username: libary.getCurrentUser(req.user) });
                                    });
                                });
                            } else {
                                res.send('Chỉnh sửa thông tin khóa học thất bại. Bạn vui lòng tạo lại khóa học.' + err)
                            }
                        })
                    } else {
                        courseModel.findByIdAndUpdate(req.query.courseId, {
                            name: fields.name,
                            description: fields.description,
                            content: fields.content,
                        }, (err, course) => {
                            courseModel.findById(req.query.courseId, (err, course) => {
                                return res.render('instructor/edit-course', { course: course, editCourseMessage: 'Cập nhật thông tin khóa học thành công.', username: libary.getCurrentUser(req.user) });
                            });
                        });
                    };
                });
            } else {
                return res.send('Bạn không có quyền chỉnh sửa khóa học này.')
            }
        } else {
            return res.send('Khóa học không tồn tại, vui lòng quay trở lại.')
        }
    })
}

exports.getCourseDetail = (req, res) => {
    courseModel.findById(req.query.courseId).where(approved, true).populate('instructor').exec((err, course) => {
        return res.render('instructor/course-detail', { course: course, username: libary.getCurrentUser(req.user) });
    });
}

exports.getStudentOfCourse = (req, res) => {
    courseModel.findById(req.query.courseId).where(approved, true).populate('learner').exec((err, course) => {
        res.render('instructor/student-of-the-course', { course: course, username: libary.getCurrentUser(req.user) });
    });
}

exports.getDeleteCourse = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if (course) {
            if(course.approved == true){
                if (req.user._id.equals(course.instructor)) {
                    courseModel.findByIdAndRemove(req.query.courseId, (err, course) => {
                        lessonModel.remove({ course: req.query.courseId }).exec();
                        courseModel.find({ instructor: req.user._id }, (err, courses) => {
                            res.render('instructor/courses', { courses: courses, title: 'Khóa học bạn đã tạo', msg: 'Xóa khóa học ' + course.name + ' thành công.', username: libary.getCurrentUser(req.user) });
                        });
                    });
                } 
            }else{
                return res.send('Khóa học này chưa được quản trị viên phê duyệt.');
            }
        } else {
            return res.send('Khóa học này không tồn tại, vui lòng quay trở lại');
        }
    });
}

exports.getMyCourseInformation = (req, res) => {
    courseModel.findById(req.query.courseId).where(approved, true).populate('instructor').exec((err, course) => {
        if (course) {
            if (req.user._id.equals(course.instructor._id)) {
                res.render('instructor/my-course-information', { course: course, username: libary.getCurrentUser(req.user) });
            } else {
                return res.redirect('/instructor/course-detail?courseId=' + req.query.courseId);
            }
        } else {
            return res.send('Khóa học này không tồn tại, vui lòng quay trở lại');
        }
    });
}