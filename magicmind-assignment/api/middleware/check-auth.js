'use strict';
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.teacherData = decoded;
		next();
	} catch (err) {
		res.status(401).json({
			success: false,
			message:
				'You are Unauthorized to access this feature, kindly Login and Retry!'
		});
	}
};
