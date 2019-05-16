const library = require('../library');
const userModel = require('../../models/user');

exports.getIndex = (req, res) => {
    return res.redirect('/instructor/courses')
    // res.render('instructor/index', {username: library.getCurrentUser(req.user)});
}

exports.getSetting = (req, res) => {
    res.render('instructor/setting', {user: req.user, username: library.getCurrentUser(req.user)});
}

exports.postSetting = (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        'local.password': req.body.password,
        'info.firstname': req.body.firstname,
        'info.lastname': req.body.lastname
    }, (err, user) => {
        userModel.findById(req.user._id, (err, user) => {
            res.render('instructor/setting', {user: user, updateProfileMessage: 'Cập nhật thông tin thành công', username: library.getCurrentUser(user)});
        });
    });
}