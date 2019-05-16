const library = require('../library');
const userModel = require('../../models/user');

exports.getIndex = (req, res) => {
    return res.redirect('/student/courses');
    // res.render('student/index', {username: library.getCurrentUser(req.user)});
}

exports.getSetting = (req, res) => {
    res.render('student/setting', {user: req.user, username: library.getCurrentUser(req.user)});
}
exports.postSetting = (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        'local.password': req.body.password,
        'info.firstname': req.body.firstname,
        'info.lastname': req.body.lastname
    }, (err, user) => {
        userModel.findById(req.user._id, (err, user) => {
            res.render('student/setting', {user: user, updateProfileMessage: 'Cập nhật thông tin thành công', username: library.getCurrentUser(user)});
        });
    });
}