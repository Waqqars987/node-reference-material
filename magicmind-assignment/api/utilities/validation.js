'use strict';
const Joi = require('@hapi/joi');

/* School Validations */
exports.registerSchoolValidation = data => {
	const schema = Joi.object({
		schoolName: Joi.string().required(),
		address: Joi.string().required(),
		phoneNum: Joi.string().min(7).required() // Shortest Phone Number is of 7 digits
	});
	return schema.validate(data);
};

exports.getSchoolValidation = data => {
	const schema = Joi.object({
		schoolName: Joi.string().required()
	});
	return schema.validate(data);
};

/* Teacher Validations */
exports.addTeacherValidation = data => {
	const schema = Joi.object({
		teacherName: Joi.string().required(),
		password: Joi.string().min(6).required(),
		schoolId: Joi.string().min(24).required() // MongoDB Object ID must be 24 characters long
	});
	return schema.validate(data);
};

exports.loginTeacherValidation = data => {
	const schema = Joi.object({
		teacherName: Joi.string().required(),
		password: Joi.string().required()
	});
	return schema.validate(data);
};

exports.getTeacherValidation = data => {
	const schema = Joi.object({
		teacherName: Joi.string().required()
	});
	return schema.validate(data);
};

/* Student Data and Marks Validation */
exports.addStudentDataValidation = data => {
	const schema = Joi.object({
		studentName: Joi.string().required(),
		class: Joi.number().required(),
		roll: Joi.number().required(),
		schoolId: Joi.string().min(24).required(), // MongoDB Object ID must be 24 characters long
		totalMarks: Joi.number().required()
	});
	return schema.validate(data);
};
