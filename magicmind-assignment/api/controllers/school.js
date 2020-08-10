'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const School = require('../models/school');
const {
	registerSchoolValidation,
	getSchoolValidation
} = require('../utilities/validation');

// Add a new school
exports.registerSchool = async (req, res, next) => {
	// Validating Request Body Data
	const { error } = registerSchoolValidation(req.body);
	if (error) {
		return res
			.status(400)
			.send({ success: false, message: error.details[0].message });
	}
	try {
		const checkSchools = await School.find({
			schoolName: req.body.schoolName
		});
		if (checkSchools.length >= 1) {
			return res.status(409).send({
				success: false,
				message: 'School Name Already Registered!'
			});
		}
		const newSchool = new School({
			_id: mongoose.Types.ObjectId(),
			schoolName: req.body.schoolName,
			address: req.body.address,
			phoneNum: +req.body.phoneNum.trim()
		});
		await newSchool.save();
		res.status(201).send({
			success: true,
			message: 'School Successfully Registered!'
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({ success: false, error: err });
	}
};

// List all schools
exports.getSchools = async (req, res, next) => {
	try {
		const schools = await School.find().select(
			'_id schoolName address phoneNum'
		);
		console.log(schools.length);
		if (schools.length === 0) {
			return res.status(404).send({
				success: false,
				message: 'No Schools Registered in the Database!'
			});
		}
		res.status(200).send({
			success: schools.length > 0 ? true : false,
			data: {
				schools: schools,
				schoolCount: schools.length
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, error: err });
	}
};

// List school by school name
exports.getSchool = async (req, res, next) => {
	// Validating query param
	const { error } = getSchoolValidation(req.query);
	if (error) {
		return res
			.status(400)
			.send({ success: false, message: error.details[0].message });
	}
	try {
		const school = await School.findOne({
			schoolName: req.query.schoolName
		}).select('_id schoolName address phoneNum');

		if (!school) {
			return res.status(404).send({
				success: false,
				message: 'School Name Not Found in the Database!'
			});
		}
		res.status(200).send({
			success: true,
			data: {
				school: school
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, error: err });
	}
};
