'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MarksSchema = new Schema({
	_id: Schema.Types.ObjectId,
	studentId: {
		type: Schema.Types.ObjectId,
		ref: 'Student',
		trim: true,
		required: true
	},
	totalMarks: {
		type: Number,
		required: true
	},
	grade: {
		type: String,
		trim: true,
		uppercase: true,
		enum: ['PASS', 'FAIL'],
		required: true
	},
	teacherId: {
		type: Schema.Types.ObjectId,
		ref: 'Teacher',
		trim: true,
		required: true
	}
});

module.exports = mongoose.model('Marks', MarksSchema);
