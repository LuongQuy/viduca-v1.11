var express = require('express');
var router = express.Router();

const courseController = require('../controllers/student/courseController');
const lessonController = require('../controllers/student/lessonController');
const classroomController = require('../controllers/student/classroomController');
const studentController = require('../controllers/student/studentController');
const authController = require('../controllers/authController');