'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
	_id: Schema.Types.ObjectId,
	schoolName: {
		type: String,
		unique: true,
		trim: true,
		uppercase: true,
		required: true
	},
	address: {
		type: String,
		trim: true,
		uppercase: true,
		required: true
	},
	phoneNum: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('School', SchoolSchema);
