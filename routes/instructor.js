var express = require('express');
var router = express.Router();

const courseController = require('../controllers/instructor/courseController');
const classroomController = require('../controllers/instructor/classroomController');
const authController = require('../controllers/authController');
const instructorController = require('../controllers/instructor/instructorController');
const lessonController = require('../controllers/instructor/lessonController');

router.get('/', authController.isLogged, authController.isInstructor, instructorController.getIndex);

router.get('/courses', authController.isLogged, authController.isInstructor, courseController.getCourses);

router.get('/my-courses', authController.isLogged, authController.isInstructor, courseController.getMyCourses);

router.get('/create-new-course', authController.isLogged, authController.isInstructor, courseController.getCreateNewCourse);

router.post('/create-new-course', authController.isLogged, authController.isInstructor, courseController.postCreateNewCourse);

router.get('/edit-course', authController.isLogged, authController.isInstructor, courseController.getEditCourse);

router.post('/edit-course', authController.isLogged, authController.isInstructor, courseController.postEditCourse);

router.get('/course-detail', authController.isLogged, authController.isInstructor, courseController.getCourseDetail);

router.get('/my-course-information', authController.isLogged, authController.isInstructor, courseController.getMyCourseInformation);

router.get('/delete-course', authController.isLogged, authController.isInstructor, courseController.getDeleteCourse);

router.get('/student-of-the-course', authController.isLogged, authController.isInstructor, courseController.getStudentOfCourse);

router.get('/create-new-lesson', authController.isLogged, authController.isInstructor, lessonController.getCreateNewLesson);

router.post('/create-new-lesson', authController.isLogged, authController.isInstructor, lessonController.postCreateNewLesson);

router.get('/lesson-detail', authController.isLogged, authController.isInstructor, lessonController.getLessonDetail);

router.get('/edit-lesson', authController.isLogged, authController.isInstructor, lessonController.getEditLesson);

router.post('/edit-lesson', authController.isLogged, authController.isInstructor, lessonController.postEditLesson);

router.get('/show-lesson-list', authController.isLogged, authController.isInstructor, lessonController.getShowLessonList);

router.get('/delete-lesson', authController.isLogged, authController.isInstructor, lessonController.getDeleteLesson);

router.get('/classroom', authController.isLogged, authController.isInstructor, classroomController.getClassroom);

router.get('/show-attendance-list', authController.isLogged, authController.isInstructor, lessonController.getAttendanceList);

router.get('/setting', authController.isLogged, authController.isInstructor, instructorController.getSetting);

router.post('/setting', authController.isLogged, authController.isInstructor, instructorController.postSetting);

module.exports = router;
