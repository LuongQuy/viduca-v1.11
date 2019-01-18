const passport = require('passport');
const localStrategy = require('passport-local');
const users = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    users.findById(id, (err, user) => {
        return done(null, user);
    })
});

passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    users.findOne({'local.email': email, 'local.password': password}, (err, user) => {
        if(user) {
            if(user.status === 'ACTIVE'){
                return done(null, user);
            }else if(user.status === 'INACTIVE'){
                return done('Tài khoản của bạn không được kích hoạt', null)
            }else if(user.status === 'SUSPENDED'){
                return done('Tài khoản của bạn đã bị khóa', null);
            }
        }
        return ('Email hoặc password không đúng', null);
    });
}));

exports.getLogin = (req, res) => {
    res.render('login');
}
exports.postLogin = passport.authenticate('local.login', {
    successRedirect: '/student',
    failureRedirect: '/'
});

exports.getLogout = (req, res) => {
    req.logout();
    res.redirect('/');
}