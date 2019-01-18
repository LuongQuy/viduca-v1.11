const userModel = require('../../models/user');
const library = require('../library');

exports.getIndexManageInstructor = (req, res) => {
    res.render('admin/manage-instructor/index', { username: library.getCurrentUser(req.user) });
}

exports.getImportNewInstructor = (req, res) => {
    res.render('admin/manage-instructor/import-new-instructor', { username: library.getCurrentUser(req.user) });
}

const csv = require("fast-csv");
const formidable = require('formidable');
var stream;
const fs = require('fs');

exports.postImportNewInstructor = (req, res) => {
    var newPath = '';
    const form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '../../../public/file-import-new-instructor';
    form.parse(req, function (err, fields, files) {
        stream = fs.createReadStream(files.fileNewInstructor.path);
        var csvStream = csv().on("data", data => {
            userModel.findOne({ 'local.email': data[0] }, (err, user) => {
                if (!user) {
                    let newUser = new userModel({
                        'local.email': data[0],
                        'local.password': data[0],
                        role: 'INSTRUCTOR',
                        status: 'ACTIVE'
                    });
                    newUser.save();
                }
            });
        }).on("end", () => { res.render('admin/manage-instructor/import-new-instructor', { importMessage: 'Nhập mới giảng viên thành công', username: library.getCurrentUser(req.user) }) });
        stream.pipe(csvStream);
    });
}

exports.postAddNewInstructor = (req, res) => {
    userModel.findOne({ 'local.email': req.body.emailNewInstructor }, (err, user) => {
        if (!user) {
            const newUser = new userModel({
                'local.email': req.body.emailNewInstructor,
                'local.password': req.body.emailNewInstructor,
                role: 'INSTRUCTOR',
                status: 'ACTIVE'
            });
            newUser.save((err, user) => {
                res.render('admin/manage-instructor/import-new-instructor', { addNewInstructorMessage: 'Thêm mới giảng viên ' + req.body.emailNewInstructor + ' thành công', username: library.getCurrentUser(req.user) });
            });
        } else {
            if(user.role === 'INSTRUCTOR'){
                res.render('admin/manage-instructor/import-new-instructor', { addNewInstructorMessage: 'Giảng viên ' + req.body.emailNewInstructor + ' đã tồn tại', username: library.getCurrentUser(req.user) });
            }else if(user.role === 'STUDENT'){
                res.render('admin/manage-instructor/import-new-instructor', { addNewInstructorMessage: 'Thêm mới giảng viên không thành công. Tài khoản' + req.body.emailNewInstructor + ' đã là tài khoản sinh viên.', username: library.getCurrentUser(req.user) });
            }else if(user.role === 'ADMIN'){
                res.render('admin/manage-instructor/import-new-instructor', { addNewInstructorMessage: 'Thêm mới giảng viên không thành công. Tài khoản' + req.body.emailNewInstructor + ' đã là tài khoản giảng viên.', username: library.getCurrentUser(req.user) });
            }
        }
    });
}

exports.getShowInstructorList = (req, res) => {
    userModel.find({ role: 'INSTRUCTOR' }, (err, instructors) => {
        res.render('admin/manage-instructor/show-instructor-list', { instructors: instructors, username: library.getCurrentUser(req.user) });
    });
}

exports.getEditInstructor = (req, res) => {
    userModel.findOne({ _id: req.query.instructorId }, (err, instructor) => {
        res.render('admin/manage-instructor/edit-instructor', { instructor: instructor, username: library.getCurrentUser(req.user) });
    });
}

exports.postEditInstructor = (req, res) => {
    userModel.findByIdAndUpdate(req.query.instructorId, {
        'local.email': req.body.email,
        'local.password': req.body.password,
        'info.firstname': req.body.firstname,
        'info.lastname': req.body.lastname,
        'status': req.body.status
    }, (err, instructor) => {
        userModel.findById(req.query.instructorId, (err, instructor) => {
            res.render('admin/manage-instructor/edit-instructor', { instructor: instructor, editInstructMessage: 'Cập nhật thông tin giảng viên thành công.', username: library.getCurrentUser(req.user) });
        });
    });
}

exports.getDeleteInstructor = (req, res) => {
    userModel.findByIdAndRemove(req.query.instructorId, (err, instructor) => {
        if(instructor){
            userModel.find({role: 'INSTRUCTOR'}, (err, instructors) => {
                return res.render('admin/manage-instructor/show-instructor-list', {instructors: instructors, msg: 'Xóa thành công giảng viên ' + instructor.local.email ,username: library.getCurrentUser(req.user)})
            });
        }else{
            res.send('Giảng viên này không tồn tại. Vui lòng quay trở lại.')
        }
    });
}