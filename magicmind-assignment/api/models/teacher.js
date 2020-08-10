'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
	_id: Schema.Types.ObjectId,
	teacherName: {
		type: String,
		unique: true, // Using Teacher Name as Unique ID other than Document ID(_id) for Auth Purpose
		uppercase: true,
		trim: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	schoolId: {
		type: Schema.Types.ObjectId,
		ref: 'School',
		trim: true,
		required: true
	}
});

module.exports = mongoose.model('Teacher', TeacherSchema);
