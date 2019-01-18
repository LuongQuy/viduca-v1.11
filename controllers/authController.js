exports.isLogged = (req, res, next) => {
    if(req.user) return next();
    return res.redirect('/');
}
exports.notLogged = (req, res, next) => {
    if(!req.user) return next();
    else{
        if(req.user.role === 'STUDENT') res.redirect('/student');
        else if(req.user.role === 'INSTRUCTOR') res.redirect('/instructor');
        else if(req.user.role === 'ADMIN') res.redirect('/admin');
    }
}
exports.isStudent = (req, res, next) => {
    if(req.user.role === 'STUDENT') return next();
    else if(req.user.role === 'INSTRUCTOR') return res.redirect('/instructor');
    else if(req.user.role === 'ADMIN') return res.redirect('/admin');
}
exports.isInstructor = (req, res, next) => {
    if(req.user.role === 'INSTRUCTOR') return next();
    else if(req.user.role === 'STUDENT') return res.redirect('/student');
    else if(req.user.role === 'ADMIN') return res.redirect('/admin');
}
exports.isAdmin = (req, res, next) => {
    if(req.user.role === 'ADMIN') return next();
    else if(req.user.role === 'STUDENT') return res.redirect('/student');
    else if(req.user.role === 'INSTRUCTOR') return res.redirect('/instructor');
}