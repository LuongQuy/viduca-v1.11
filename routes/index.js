var express = require('express');
var router = express.Router();

const loginController = require('../controllers/loginController');
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', authController.notLogged, loginController.getLogin);
router.post('/', authController.notLogged, loginController.postLogin);

router.get('/logout', loginController.getLogout);

router.get('/login', (req, res) => {
    return res.render('login', {message: 'Email hoặc Password sai, vui lòng đăng nhập lại.'});
});

module.exports = router;
