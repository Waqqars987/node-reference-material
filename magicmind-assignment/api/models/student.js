'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
	_id: Schema.Types.ObjectId,
	studentName: {
		type: String,
		uppercase: true,
		trim: true,
		required: true
	},
	class: {
		type: Number,
		required: true
	},
	roll: {
		type: Number,
		required: true
	},
	schoolId: {
		type: Schema.Types.ObjectId,
		ref: 'School',
		trim: true,
		required: true
	}
});
// The combination of class and roll must be unique for Every Student Record
StudentSchema.index({ class: 1, roll: 1 }, { unique: true });

module.exports = mongoose.model('Student', StudentSchema);
