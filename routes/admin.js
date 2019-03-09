var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');
const manageStudentController = require('../controllers/admin/manageStudentController');
const manageInstructorController = require('../controllers/admin/manageInstructorController');
const manageCourseController = require('../controllers/admin/manageCourseController');
const adminController = require('../controllers/admin/adminController');

// manage instructor
router.get('/', authController.isLogged, authController.isAdmin, adminController.getIndex);

router.get('/manage-student', authController.isLogged, authController.isAdmin, manageStudentController.getIndexManageStudent);

router.get('/import-new-student', authController.isLogged, authController.isAdmin, manageStudentController.getImportNewStudent);

router.post('/import-new-student', authController.isLogged, authController.isAdmin, manageStudentController.postImportNewStudent);

router.post('/add-new-student', authController.isLogged, authController.isAdmin, manageStudentController.postAddNewStudent);

router.get('/show-student-list', authController.isLogged, authController.isAdmin, manageStudentController.getShowStudentList);

router.get('/edit-student', authController.isLogged, authController.isAdmin, manageStudentController.getEditStudent);

router.post('/edit-student', authController.isLogged, authController.isAdmin, manageStudentController.postEditStudent);

router.get('/delete-student', authController.isLogged, authController.isAdmin, manageStudentController.getDeleteStudent);

// manage instructor
router.get('/manage-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.getIndexManageInstructor);

router.get('/import-new-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.getImportNewInstructor);

router.post('/import-new-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.postImportNewInstructor);

router.post('/add-new-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.postAddNewInstructor);

router.get('/show-instructor-list', authController.isLogged, authController.isAdmin, manageInstructorController.getShowInstructorList);

router.get('/edit-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.getEditInstructor);

router.post('/edit-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.postEditInstructor);

router.get('/delete-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.getDeleteInstructor);

// manage other
router.get('/setting', authController.isLogged, authController.isAdmin, adminController.getSetting);

router.post('/setting', authController.isLogged, authController.isAdmin, adminController.postSetting);

// manage course
// router.get('/manage-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.getIndexManageInstructor);

// router.get('/import-new-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.getImportNewInstructor);

// router.post('/import-new-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.postImportNewInstructor);

// router.post('/add-new-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.postAddNewInstructor);

router.get('/show-course-list', authController.isLogged, authController.isAdmin, manageCourseController.getShowCourseList);

// router.get('/edit-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.getEditInstructor);

// router.post('/edit-instructor', authController.isLogged, authController.isAdmin, manageInstructorController.postEditInstructor);

router.get('/delete-course', authController.isLogged, authController.isAdmin, manageCourseController.getDeleteCourse);
router.get('/approve-course', authController.isLogged, authController.isAdmin, manageCourseController.getAppoveCourse);

// manage other
// router.get('/setting', authController.isLogged, authController.isAdmin, adminController.getSetting);

// router.post('/setting', authController.isLogged, authController.isAdmin, adminController.postSetting);


module.exports = router;
