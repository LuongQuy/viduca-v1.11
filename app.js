var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');

var fs = require('fs');

var indexRouter = require('./routes/index');
var studentRouter = require('./routes/student');
var instructorRouter = require('./routes/instructor');
var adminRouter = require('./routes/admin');

var app = express();
app.use(helmet());

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/logout', logOutRouter);
app.use('/student', studentRouter);
app.use('/instructor', instructorRouter);
app.use('/admin', adminRouter);

const lessonModel = require('./models/lesson');
var formidable = require('formidable');
app.post('/upload-slide', function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = 'public/slides';
  form.parse(req, (err, fields, file) => {
    const oldPath = file.file.path;
    const savePath = '/slides/' + file.file.name;
    const newPath = 'public' + savePath;
    fs.rename(oldPath, newPath, err => {
      if(!err){
        res.send(savePath);
      }else{
        res.send('Lỗi: ' + err);
      }
    })
  });  
})
// end upload slide

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// const user = require('./models/user');
const database = require('./configs/database');
mongoose.connect(database.dbStr, { useNewUrlParser: true });
mongoose.connection.on('error', err => console.log(err));

module.exports = app;
