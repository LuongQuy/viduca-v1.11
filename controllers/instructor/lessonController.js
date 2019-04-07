const fs = require('fs');
const formidable = require('formidable');

const lessonModel = require('../../models/lesson');
const courseModel = require('../../models/course');
const attendanceModel = require('../../models/attendance');
const library = require('../library');

exports.getLessonDetail = (req, res) => {
    lessonModel.findById(req.query.lessonId, (err, lesson) => {
        if (lesson) {
            if (req.user._id.equals(lesson.instructor)) {
                return res.render('instructor/lesson-detail', { lesson: lesson, username: library.getCurrentUser(req.user) });
            } else {
                return res.send('Bạn không có quyền quản trị bài học này.');
            }
        } else {
            return res.send('Không tồn tại bài học này, vui lòng quay trở lại.');
        }
    });
}

exports.getCreateNewLesson = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if (course) {
            if (req.user._id.equals(course.instructor)) {
                lessonModel.find({ course: req.query.courseId }, (err, lessons) => {
                    return res.render('instructor/create-new-lesson', { course: course, lessons: lessons, username: library.getCurrentUser(req.user) });
                });
            } else {
                return res.redirect('/instructor/course-detail?courseId=' + req.query.courseId);
            }
        } else {
            return res.send('Khóa học này không tồn tại, vui lòng quay trở lại.')
        }
    });
}

exports.postCreateNewLesson = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if (course) {
            if (req.user._id.equals(course.instructor)) {
                const form = formidable.IncomingForm();
                form.uploadDir = 'public/slides/';
                form.parse(req, (err, fields, file) => {
                    if (!err) {
                        if (file.lessonSlide.size != 0) {
                            const oldPath = file.lessonSlide.path;
                            const savePath = '/slides/' + Date.now() + '-' + file.lessonSlide.name;
                            const newPath = 'public' + savePath;
                            fs.rename(oldPath, newPath, err => {
                                if (!err) {
                                    var date = new Date(fields.startDate);
                                    const newLesson = new lessonModel({
                                        name: fields.lessonName,
                                        content: fields.lessonContent,
                                        slides: { name: file.lessonSlide.name, url: savePath },
                                        course: req.query.courseId,
                                        date: date.getDate() + ' - ' + date.getDay() + ' - ' + date.getFullYear(),
                                        instructor: req.user._id
                                    });
                                    newLesson.save((err, lesson) => {
                                        res.redirect('/instructor/create-new-lesson?courseId=' + req.query.courseId);
                                    });
                                } else {
                                    return res.send('Tạo buổi học không thành công, vui lòng tạo lại.');
                                }
                            });
                        } else {
                            var date = new Date(fields.startDate);
                            const newLesson = new lessonModel({
                                name: fields.lessonName,
                                content: fields.lessonContent,
                                course: req.query.courseId,
                                date: date.getDate() + ' - ' + date.getDay() + ' - ' + date.getFullYear(),
                                instructor: req.user._id
                            });
                            newLesson.save((err, lesson) => {
                                res.redirect('/instructor/create-new-lesson?courseId=' + req.query.courseId);
                            });
                        }
                    } else {
                        return res.send('Tạo buổi học không thành công, vui lòng tạo lại.');
                    }
                });
            } else {
                return res.send('Bạn không có quyền thêm bài học vào khóa học này, vui lòng quay trở lại.')
            }
        } else {
            return res.send('Khóa học này không tồn tại, vui lòng quay trở lại.')
        }
    });
}

exports.getEditLesson = (req, res) => {
    lessonModel.findById(req.query.lessonId, (err, lesson) => {
        if (lesson) {
            if (req.user._id.equals(lesson.instructor)) {
                return res.render('instructor/edit-lesson', { lesson: lesson, username: library.getCurrentUser(req.user) });
            } else {
                return res.send('Bạn không có quyền chỉnh sửa thông tin bài học này, vui lòng quay trở lại.');
            }
        } else {
            return res.send('Không tồn tại bài học này, vui lòng quay trở lại.');
        }
    });
}

exports.postEditLesson = (req, res) => {
    lessonModel.findById(req.query.lessonId, (err, lesson) => {
        if (req.user._id.equals(lesson.instructor)) {
            const form = formidable.IncomingForm();
            form.uploadDir = 'public/slides/';
            form.parse(req, (err, fields, file) => {
                if (!err) {
                    if (file.lessonSlide.size != 0) {
                        const oldPath = file.lessonSlide.path;
                        const savePath = '/slides/' + Date.now() + '-' + file.lessonSlide.name;
                        const newPath = 'public' + savePath;
                        fs.rename(oldPath, newPath, err => {
                            if (!err) {
                                lesson.update({
                                    name: fields.lessonName,
                                    content: fields.lessonContent,
                                    slides: { name: file.lessonSlide.name, url: savePath },
                                }, (err, lesson) => {
                                    res.redirect('/instructor/edit-lesson?lessonId=' + req.query.lessonId);
                                });
                            } else {
                                return res.send('Chỉnh sửa buổi học không thành công, vui lòng tạo lại.');
                            }
                        });
                    } else {
                        lesson.update({
                            name: fields.lessonName,
                            content: fields.lessonContent,
                        }, (err, lesson) => {
                            res.redirect('/instructor/edit-lesson?lessonId=' + req.query.lessonId);
                        });
                    }
                } else {
                    return res.send('Cập nhật buổi học không thành công, vui lòng quay lại.');
                }
            });
        } else {
            return res.send('Bạn không có quyền chỉnh sửa buổi này, vui lòng quay lại.');
        }
    });
}

exports.getShowLessonList = (req, res) => {
    courseModel.findById(req.query.courseId, (err, course) => {
        if (course) {
            lessonModel.find({ course: req.query.courseId }, (err, lessons) => {
                return res.render('instructor/show-lesson-list', { course: course, lessons: lessons, username: library.getCurrentUser(req.user) });
            });
        } else {
            res.send('Khóa học không tồn tại, vui lòng quay trở lại');
        }
    });
}

exports.getDeleteLesson = (req, res) => {
    lessonModel.findById(req.query.lessonId, (err, lesson) => {
        if (lesson) {
            if (req.user._id.equals(lesson.instructor)) {
                lessonModel.findByIdAndRemove(req.query.lessonId, (err, lesson) => {
                    courseModel.findById(lesson.course, (err, course) => {
                        lessonModel.find({ course: req.query.courseId }, (err, lessons) => {
                            return res.render('instructor/create-new-lesson', {
                                course: course,
                                lessons: lessons,
                                msg: 'Xóa thành công buổi học: ' + lesson.name,
                                username: library.getCurrentUser(req.user)
                            });
                        });
                    });
                });
            } else {
                return res.send('Bạn không có quyển xóa buổi học này, vui lòng quay trở lại.');
            }
        } else {
            return res.send('Buổi học này không tồn tại, vui lòng quay trở lại.');
        }
    });
}

exports.getAttendanceList = (req, res) => {
    attendanceModel.find({lesson: req.query.lessonId}).populate('lesson').populate('student').exec((err, attendances) => {
    if(!err){
        return res.render('instructor/show-attendance-list', { lesson: attendances[0].lesson, attendances: attendances, username: library.getCurrentUser(req.user) });
    }else{
        return res.send('Chưa có danh sách điểm danh, vui lòng quay trở lại');
    }
    });
}