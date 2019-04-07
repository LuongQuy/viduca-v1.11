var express = require('express');
var router = express.Router();

const courseController = require('../controllers/student/courseController');
const lessonController = require('../controllers/student/lessonController');
const classroomController = require('../controllers/student/classroomController');
const studentController = require('../controllers/student/studentController');
const authController = require('../controllers/authController');
const openviduController = require('../controllers/openviduController');
const quizController = require('../controllers/student/quizController');

router.get('/', authController.isLogged, authController.isStudent, studentController.getIndex);

router.get('/courses', authController.isLogged, authController.isStudent, courseController.getCourses);

router.get('/my-courses', authController.isLogged, authController.isStudent, courseController.getMyCourses);

router.get('/course-detail', authController.isLogged, authController.isStudent, courseController.getCourseDetail);

router.get('/setting', authController.isLogged, authController.isStudent, studentController.getSetting);

router.post('/setting', authController.isLogged, authController.isStudent, studentController.postSetting);

// router.get('/register-in-the-course', authController.isLogged, authController.isStudent, courseController.getRegisterCourse);

router.post('/join-in-course', authController.isLogged, authController.isStudent, courseController.postJoinInCourse);

router.get('/quit-the-course', authController.isLogged, authController.isStudent, courseController.getQuitCourse);

router.get('/show-lesson-list', authController.isLogged, authController.isStudent, lessonController.getShowLessonList);

router.get('/lesson-detail', authController.isLogged, authController.isStudent, lessonController.getLessonDetail);

router.get('/classroom', authController.isLogged, authController.isStudent, classroomController.getClassroom);

// router.get('/classroom', authController.isLogged, courseController.getClassroom);

// router.get('/lessons', authController.isLogged, courseController.getLessons);

router.post('/leave-session', authController.isLogged, authController.isStudent, openviduController.postLeaveSession);

router.post('/save-result-quiz', authController.isLogged, authController.isStudent, quizController.postSaveResultQuiz);

router.get('/get-quiz', authController.isLogged, authController.isStudent, quizController.getQuiz);

module.exports = router;
