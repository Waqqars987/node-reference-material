'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const School = require('../models/school');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Marks = require('../models/marks');
const { addStudentDataValidation } = require('../utilities/validation');

// Add a new student data
exports.addStudentData = async (req, res, next) => {
	//Validating Request Body Data
	const { error } = addStudentDataValidation(req.body);
	if (error) {
		return res
			.status(400)
			.send({ success: false, message: error.details[0].message });
	}
	try {
		// Check if schoolId is valid
		const checkSchoolId = await School.findById(req.body.schoolId.trim());
		if (!checkSchoolId) {
			return res.status(409).send({
				success: false,
				message: 'School ID is Invalid!'
			});
		}

		// Check if the teacherId is associated with the provided schoolId
		const checkTeacherAgainstSchool = await Teacher.findById(
			req.teacherData._id
		)
			.where('schoolId')
			.equals(req.body.schoolId.trim());
		if (!checkTeacherAgainstSchool) {
			return res.status(409).send({
				success: false,
				message: 'Teacher ID is not associated with provided School ID!'
			});
		}

		// Check if student's roll number is already present in the Student collection
		const checkStudentData = await Student.findOne({
			roll: +req.body.roll,
			class: +req.body.class
		});
		// Exact Student Record is Already Present in the Student and Marks Collections
		if (checkStudentData) {
			/* Not allowing the Student Data with redundant 
			Class and Roll Number to be inserted again */
			return res.status(409).send({
				success: false,
				message: `Student and Marks Data of class ${req.body.class} and roll number ${req.body.roll} is already assigned to ${checkStudentData.studentName}!`
			});

			// ! Skipping the Update Logic as Clear Instructions was not provided
			// TODO Could Update New Marks Data to Marks Collection for the given Student ID
		} else {
			// Saving New Student Data to Student Collection
			const newStudentData = new Student({
				_id: mongoose.Types.ObjectId(),
				studentName: req.body.studentName,
				class: +req.body.class,
				roll: +req.body.roll,
				schoolId: req.body.schoolId
			});
			const savedNewStudentData = await newStudentData.save();
			// Saving New Marks Data to Marks Collection
			const newMarksData = new Marks({
				_id: mongoose.Types.ObjectId(),
				studentId: savedNewStudentData._id,
				totalMarks: +req.body.totalMarks,
				grade: req.body.totalMarks > 50 ? 'PASS' : 'FAIL',
				teacherId: req.teacherData._id
			});
			await newMarksData.save();
			res.status(201).send({
				success: true,
				message: 'Student Data Created Sucessfully!'
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({ success: false, error: err });
	}
};

// List All Student Related Data
exports.getAllStudentData = async (req, res, next) => {
	try {
		const studentMarks = await Marks.find().populate({
			path: 'studentId teacherId',
			populate: { path: 'schoolId' }
		});
		let transformedOutput = [];
		studentMarks.map(studentMark => {
			const studentInfo = {
				studentId: studentMark.studentId._id,
				marksId: studentMark._id,
				studentName: studentMark.studentId.studentName,
				class: studentMark.studentId.class,
				roll: studentMark.studentId.roll,
				totalMarks: studentMark.totalMarks,
				grade: studentMark.grade,
				schoolInfo: {
					schoolId: studentMark.studentId.schoolId._id,
					schoolName: studentMark.studentId.schoolId.schoolName,
					address: studentMark.studentId.schoolId.address,
					phoneNum: studentMark.studentId.schoolId.phoneNum
				},
				teacherName: studentMark.teacherId.teacherName
			};
			transformedOutput.push(studentInfo);
		});
		res.status(200).send({
			success: transformedOutput.length > 0 ? true : false,
			data: {
				studentsInfo: transformedOutput,
				studentsCount: transformedOutput.length
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, error: err });
	}
};
