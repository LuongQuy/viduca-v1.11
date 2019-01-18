var express = require('express');
var router = express.Router();

const loginController = require('../controllers/loginController');
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', authController.notLogged, loginController.getLogin);
router.post('/', authController.notLogged, loginController.postLogin);

router.get('/logout', loginController.getLogout);

module.exports = router;
