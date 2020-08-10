'use strict';
const express = require('express');
const router = express.Router();

const {
	addTeacher,
	loginTeacher,
	getTeachers,
	getTeacher
} = require('../controllers/teacher');

router.post('/register', addTeacher);
router.get('/login', loginTeacher);
router.get('/get', getTeacher);
router.get('/get-all', getTeachers);

module.exports = router;
