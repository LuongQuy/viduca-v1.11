const fs = require('fs');
const formidable = require('formidable');

const courseModel = require('../../models/course');
const lessonModel = require('../../models/lesson');
const resultQuizModel = require('../../models/result-quiz');
const reduceResultQuizModel = require('../../models/reduce-result-quiz');
const attendanceModel = require('../../models/attendance');
const resultQuizCourseModel = require('../../models/reduce-result-quiz');
const library = require('../library');

exports.getCourses = (req, res) => {
    courseModel.find({approved: true}, (err, courses) => {
        res.render('instructor/courses', { title: 'Tất cả khóa học', courses: courses, username: library.getCurrentUser(req.user) });
    });
}

exports.getMyCourses = (req, res) => {
    courseModel.find({ instructor: req.user._id, approved: true }, (err, courses) => {
        res.render('instructor/courses', { title: 'Khóa học bạn đã tạo', courses: courses, username: library.getCurrentUser(req.user) });
    });
}

exports.getCreateNewCourse = (req, res) => {
    res.render('instructor/create-new-course', { username: library.getCurrentUser(req.user) });
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
                        avatar: savePath,
                        instructor: req.user._id,
                        approved: false,
                        password: fields.password
                    });
                    newCourse.save((err, course) => {
                        return res.render('instructor/create-new-course', { createNewCourseMessage: 'Tạo khóa học mới thành công.', username: library.getCurrentUser(req.user) });
                    });
                } else {
                    res.send('Tạo khóa học mới thất bại. Bạn vui lòng tạo lại khóa học.' + err)
                }
            })
        } else {
            var newCourse = new courseModel({
                name: fields.name,
                description: fields.description,
                instructor: req.user._id,
                approved: false,
                password: fields.password
            });
            newCourse.save((err, course) => {
                return res.render('instructor/create-new-course', { createNewCourseMessage: 'Tạo khóa học thành công.', username: library.getCurrentUser(req.user) })
            })
        };
    });
}

exports.getEditCourse = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if(course){
            if (course.approved == true) {
                if (req.user._id.equals(course.instructor)) {
                    res.render('instructor/edit-course', { course: course, username: library.getCurrentUser(req.user) });
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
                                    avatar: savePath,
                                    password: fields.password
                                }, (err, course) => {
                                    courseModel.findById(req.query.courseId, (err, course) => {
                                        return res.render('instructor/edit-course', { course: course, editCourseMessage: 'Cập nhật thông tin khóa học thành công.', username: library.getCurrentUser(req.user) });
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
                            password: fields.password
                        }, (err, course) => {
                            courseModel.findById(req.query.courseId, (err, course) => {
                                return res.render('instructor/edit-course', { course: course, editCourseMessage: 'Cập nhật thông tin khóa học thành công.', username: library.getCurrentUser(req.user) });
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
    courseModel.findById(req.query.courseId).where('approved', true).populate('instructor').exec((err, course) => {
        lessonModel.find({course: req.query.courseId}, (err, lessons) => {
            return res.render('instructor/course-detail', {lessons: lessons, course: course, username: library.getCurrentUser(req.user) });
        });
    });
}

exports.getStudentOfCourse = (req, res) => {
    courseModel.findById(req.query.courseId).where('approved', true).populate('learner').exec((err, course) => {
        if(course){
            return res.render('instructor/student-of-the-course', { course: course, username: library.getCurrentUser(req.user) });
        }else{
            return res.send('Khóa học không tồn tại, vui lòng quay trở lại.');
        }
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
                            res.render('instructor/courses', { courses: courses, title: 'Khóa học bạn đã tạo', msg: 'Xóa khóa học ' + course.name + ' thành công.', username: library.getCurrentUser(req.user) });
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
    courseModel.findById(req.query.courseId).where('approved', true).populate('instructor').exec((err, course) => {
        if (course) {
            if (req.user._id.equals(course.instructor._id)) {
                lessonModel.find({course: req.query.courseId}, (err, lessons) => {
                    res.render('instructor/my-course-information', {lessons: lessons, course: course, username: library.getCurrentUser(req.user) });
                });
                
            } else {
                return res.redirect('/instructor/course-detail?courseId=' + req.query.courseId);
            }
        } else {
            return res.send('Khóa học này không tồn tại, vui lòng quay trở lại');
        }
    });
}

exports.getAttendanceCourse = (req, res) => {
    var courseId = req.query.courseId;
    courseModel.findOne({_id: courseId}).select('name learner').populate('learner').exec((err, course) => {
        lessonModel.find({course: courseId}).select('name date participant').exec((err, lessons) => {        
            return res.render('instructor/course/show-attendance-course', {lessons: lessons, course: course, username: library.getCurrentUser(req.user) });
        });
    });
}

exports.getResultQuizOfCourse = (req, res) => {
    var courseId = req.query.courseId;
    courseModel.findOne({_id: courseId}).select('name learner').populate('learner').exec((err, course) => {
        lessonModel.find({course: courseId}).select('name date participant').exec((err, lessons) => {   
            resultQuizCourseModel.find({course: courseId}, (err, resultQuizes) => {
                return res.render('instructor/course/show-reduce-result-quiz-course', {resultQuizes: resultQuizes, lessons: lessons, course: course, username: library.getCurrentUser(req.user) });
            })     
            
        });
    });
}

exports.getAddVideo = (req, res) => {
    var courseId = req.query.courseId;
    courseModel.findOne({_id: courseId}, (err, course) => {
        lessonModel.find({course: courseId}, (err, lessons) => {
            return res.render('instructor/course/add-video', {course: course, lessons: lessons, username: library.getCurrentUser(req.user) });
        })
    });   
}

exports.postAddVideo = (req, res) => {
    const form = formidable.IncomingForm();
    form.uploadDir = 'public/videos/';
    form.parse(req, (err, fields, file) => {
        if (!err) {
            if (file.lessonSlide.size != 0) {
                const oldPath = file.lessonSlide.path;
                const savePath = '/videos/' + Date.now() + '-' + file.lessonSlide.name;
                const newPath = 'public' + savePath;
                const lessonId = fields.lesson;
                
                lessonModel.findOne({_id: lessonId}, (err, lesson) => {
                    if(lesson){
                        fs.rename(oldPath, newPath, err => {
                            if (!err) {
                                
                                lessonModel.findOneAndUpdate({_id: lessonId}, {
                                    video: savePath
                                    
                                }, (err, lesson1) => {
                                    courseModel.findOne({_id: lesson.course}, (err, course) => {
                                        lessonModel.find({course: lesson.course}, (err, lessons) => {
                                            return res.render('instructor/course/add-video', {msg: 'Update thành công!', course: course, lessons: lessons, username: library.getCurrentUser(req.user) });
                                        })
                                    });  
                                })
                                
                            } else {
                                return res.send('Thêm video không thành công, vui lòng thêm lại.');
                            }
                        });
                    }else{
                        return res.send('Khóa học không tồn tại, vui lòng quay trở lại.');
                    }
                })
            } 
        } else {
            return res.send('Thêm video không thành công, vui lòng thêm lại.');
        }
    });
}
