const userModel = require('../../models/user');
const library = require('../library');

exports.getIndexManageStudent = (req, res) => {
    res.render('admin/manage-student/index', {username: library.getCurrentUser(req.user)});
}

exports.getImportNewStudent = (req, res) => {
    res.render('admin/manage-student/import-new-student', {username: library.getCurrentUser(req.user)});
}

const csv = require("fast-csv");
const formidable = require('formidable');
var stream;
const fs = require('fs');

exports.postImportNewStudent = (req, res) => {
    var newPath = '';
    const form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '../../../public/file-import-new-student';
    form.parse(req, function (err, fields, files) {
        stream = fs.createReadStream(files.fileNewStudent.path);
        var csvStream = csv().on("data", data => {
            userModel.findOne({ 'local.email': data[0] }, (err, user) => {
                if (!user) {
                    let newUser = new userModel({
                        'local.email': data[0],
                        'local.password': data[0],
                        role: 'STUDENT',
                        status: 'ACTIVE'
                    });
                    newUser.save();
                }
            });
        }).on("end", () => { res.render('admin/manage-student/import-new-student', { importMessage: 'Nhập mới sinh viên thành công', username: library.getCurrentUser(req.user)})});
        stream.pipe(csvStream);
    });
}

exports.postAddNewStudent = (req, res) => {
    userModel.findOne({'local.email': req.body.emailNewStudent}, (err, user) => {
        if(!user){
            const newUser = new userModel({
                'local.email': req.body.emailNewStudent,
                'local.password': req.body.emailNewStudent,
                role: 'STUDENT',
                status: 'ACTIVE'
            });
            newUser.save((err, user) => {
                res.render('admin/manage-student/import-new-student', { addNewStudentMessage: 'Thêm mới sinh viên ' + req.body.emailNewStudent + ' thành công', username: library.getCurrentUser(req.user)});
            });
        }else{
            if(user.role === 'STUDENT'){
                res.render('admin/manage-student/import-new-student', { addNewStudentMessage: 'Sinh viên ' + req.body.emailNewStudent + ' đã tồn tại', username: library.getCurrentUser(req.user)});
            }else if(user.role === 'INSTRUCTOR'){
                res.render('admin/manage-student/import-new-student', { addNewStudentMessage: 'Thêm mới sinh viên không thành công. Tài khoản ' + req.body.emailNewStudent + ' đã là tài khoản giảng viên.', username: library.getCurrentUser(req.user)});
            }else if(user.role === 'INSTRUCTOR'){
                res.render('admin/manage-student/import-new-student', { addNewStudentMessage: 'Thêm mới sinh viên không thành công. Tài khoản ' + req.body.emailNewStudent + ' đã là tài khoản quản trị viên.', username: library.getCurrentUser(req.user)});
            }
        }
    });
}

exports.getShowStudentList = (req, res) => {
    userModel.find({role: 'STUDENT'}, (err, students) => {
        res.render('admin/manage-student/show-student-list', {students: students, username: library.getCurrentUser(req.user)});
    });
}

exports.getEditStudent = (req, res) => {
    userModel.findOne({_id: req.query.studentId}, (err, student) => {
        res.render('admin/manage-student/edit-student', {student: student, username: library.getCurrentUser(req.user)});
    });
}

exports.postEditStudent = (req, res) => {
    userModel.findByIdAndUpdate(req.query.studentId, {
        'local.email': req.body.email,
        'local.password': req.body.password,
        'info.firstname': req.body.firstname,
        'info.lastname': req.body.lastname,
        'status': req.body.status
    } , (err, student) => {
        userModel.findById(req.query.studentId, (err, student) => {
            res.render('admin/manage-student/edit-student', {student: student, editStudentMessage: 'Cập nhật thông tin sinh viên thành công' ,username: library.getCurrentUser(req.user)});
        });
    });
}

exports.getDeleteStudent = (req, res) => {
    userModel.findByIdAndRemove(req.query.studentId, (err, student) => {
        if(student){
            userModel.find({role: 'STUDENT'}, (err, students) => {
                return res.render('admin/manage-student/show-student-list', {students: students, msg: 'Xóa thành công sinh viên ' + student.local.email ,username: library.getCurrentUser(req.user)})
            });
        }else{
            res.send('Không tồn tại sinh viên này.');
        }
    });
}