require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const School = require('../models/school');
const Teacher = require('../models/teacher');
const {
	addTeacherValidation,
	loginTeacherValidation,
	getTeacherValidation
} = require('../utilities/validation');

// Add a new teacher
exports.addTeacher = async (req, res, next) => {
	// Validating Request Body Data
	const { error } = addTeacherValidation(req.body);
	if (error) {
		return res
			.status(400)
			.send({ success: false, message: error.details[0].message });
	}
	try {
		// Check if teacherName exists already
		const checkTeachers = await Teacher.find({
			teacherName: req.body.teacherName
		});
		if (checkTeachers.length >= 1) {
			return res.status(409).send({
				success: false,
				message: 'Teacher Name (Username) Already Taken!'
			});
		}
		// Check if schoolId is valid
		const checkSchoolId = await School.findById(req.body.schoolId.trim());
		if (!checkSchoolId) {
			return res.status(409).send({
				success: false,
				message: 'School ID is Invalid!'
			});
		}
		//Hashing Password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password.trim(), salt);

		const newTeacher = new Teacher({
			_id: mongoose.Types.ObjectId(),
			teacherName: req.body.teacherName,
			password: hashedPassword,
			schoolId: req.body.schoolId.trim()
		});
		await newTeacher.save();
		res.status(201).send({
			success: true,
			message: 'Teacher Registered Successfully!'
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({ success: false, error: err });
	}
};

// Login a teacher
exports.loginTeacher = async (req, res, next) => {
	// Validating Query Params
	const { error } = loginTeacherValidation(req.query);
	if (error) {
		return res
			.status(400)
			.send({ success: false, message: error.details[0].message });
	}
	try {
		// Validating teacher name
		const checkTeachers = await Teacher.find({
			teacherName: req.query.teacherName
		});
		if (checkTeachers.length < 1) {
			return res.status(404).send({
				success: false,
				message: 'Teacher Name (Username) or Password is Invalid!'
			});
		}
		// Validating password
		const authResult = await bcrypt.compare(
			req.query.password.trim(),
			checkTeachers[0].password
		);
		if (!authResult) {
			return res.status(401).json({
				success: authResult,
				message: 'Teacher Name (Username) or Password is Invalid!'
			});
		}
		// Generating token
		const token = jwt.sign(
			{
				_id: checkTeachers[0]._id,
				teacherName: checkTeachers[0].teacherName
			},
			process.env.JWT_KEY,
			{
				expiresIn: '3h'
			}
		);
		return res.status(200).json({
			success: authResult,
			data: {
				token: token
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({ success: false, error: err });
	}
};

// List all teachers
exports.getTeachers = async (req, res, next) => {
	try {
		const teachers = await Teacher.find()
			.select('_id teacherName address schoolId')
			.populate('schoolId');
		if (teachers.length === 0) {
			return res.status(404).send({
				success: false,
				message: 'No Teachers Registered in the Database!'
			});
		}
		let transformedOutput = [];
		teachers.map(teacher => {
			transformedOutput.push({
				_id: teacher._id,
				teacherName: teacher.teacherName,
				schoolInfo: {
					_id: teacher.schoolId._id,
					schoolName: teacher.schoolId.schoolName,
					address: teacher.schoolId.address,
					phoneNum: teacher.schoolId.phoneNum
				}
			});
		});
		res.status(200).send({
			success: transformedOutput.length > 0 ? true : false,
			data: {
				teachers: transformedOutput,
				teacherCount: transformedOutput.length
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, error: err });
	}
};

// List teacher by teacher name
exports.getTeacher = async (req, res, next) => {
	const { error } = getTeacherValidation(req.query);
	if (error) {
		return res
			.status(400)
			.send({ success: false, message: error.details[0].message });
	}
	try {
		const teacher = await Teacher.findOne({
			teacherName: req.query.teacherName
		})
			.select('_id teacherName schoolId ')
			.populate('schoolId');

		if (!teacher) {
			return res.status(404).send({
				success: false,
				message: 'Teacher Name Not Found in the Database!'
			});
		}
		res.status(200).send({
			success: true,
			data: {
				teacher: {
					_id: teacher._id,
					teacherName: teacher.teacherName,
					schoolInfo: {
						_id: teacher.schoolId._id,
						schoolName: teacher.schoolId.schoolName,
						address: teacher.schoolId.address,
						phoneNum: teacher.schoolId.phoneNum
					}
				}
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, error: err });
	}
};
