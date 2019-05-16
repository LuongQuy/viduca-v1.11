var express = require('express');
var router = express.Router();

const courseController = require('../controllers/instructor/courseController');
const classroomController = require('../controllers/instructor/classroomController');
const authController = require('../controllers/authController');
const instructorController = require('../controllers/instructor/instructorController');
const lessonController = require('../controllers/instructor/lessonController');
const quizController = require('../controllers/instructor/quizController');
const kpiController = require('../controllers/instructor/kpiController');

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

router.get('/create-new-quiz', authController.isLogged, authController.isInstructor, quizController.getCreateNewQuiz);

router.post('/create-new-quiz', authController.isLogged, authController.isInstructor, quizController.postCreateNewQuiz);

router.get('/setting', authController.isLogged, authController.isInstructor, instructorController.getSetting);

router.post('/setting', authController.isLogged, authController.isInstructor, instructorController.postSetting);

router.get('/get-quiz', authController.isLogged, authController.isInstructor, quizController.getQuiz);

router.get('/get-result-quiz', authController.isLogged, authController.isInstructor, quizController.getResultQuiz);

router.get('/get-result-quiz-classroom', authController.isLogged, authController.isInstructor, quizController.getResultQuizClassroom);

router.get('/get-attendance-course', authController.isLogged, authController.isInstructor, courseController.getAttendanceCourse);

router.get('/get-result-quiz-of-course', authController.isLogged, authController.isInstructor, courseController.getResultQuizOfCourse);

router.get('/show-quiz-list', authController.isLogged, authController.isInstructor, quizController.getShowQuizList);

router.get('/delete-quiz', authController.isLogged, authController.isInstructor, quizController.getDeleteQuiz);

// router.get('/get-quiz-result-of-course', authController.isLogged, authController.isInstructor, courseController.getQuizResultOfCourse);

router.get('/add-video', authController.isLogged, authController.isInstructor, courseController.getAddVideo);

router.post('/add-video', authController.isLogged, authController.isInstructor, courseController.postAddVideo);

router.get('/kpi', authController.isLogged, authController.isInstructor, kpiController.getIndex);

router.get('/kpi/setup-kpi-instructor', authController.isLogged, authController.isInstructor, kpiController.getSetupKPIInstructor);

router.post('/kpi/setup-kpi-instructor', authController.isLogged, authController.isInstructor, kpiController.postSetupKPIInstructor);

router.get('/kpi/setup-kpi-student', authController.isLogged, authController.isInstructor, kpiController.getSetupKPIStudent);

router.get('/kpi/setup-kpi-student-ajax', authController.isLogged, authController.isInstructor, kpiController.getSetupKPIStudentAjax);

router.post('/kpi/setup-kpi-student', authController.isLogged, authController.isInstructor, kpiController.postSetupKPIStudent);

router.get('/kpi/get-course-list', authController.isLogged, authController.isInstructor, kpiController.getCourseList);

router.get('/kpi/show-kpi-student', authController.isLogged, authController.isInstructor, kpiController.getShowKPIStudent);

router.get('/kpi/detail-kpi-student', authController.isLogged, authController.isInstructor, kpiController.getDetailKPIStudent);

// router.get('/kpi/get-student', authController.isLogged, authController.isInstructor, kpiController.getStudent);

// router.get('/kpi/show-kpi-student', authController.isLogged, authController.isInstructor, kpiController.getShowKPIStudent);


module.exports = router;
