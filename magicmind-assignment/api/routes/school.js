'use strict';
const express = require('express');
const router = express.Router();

const {
	registerSchool,
	getSchools,
	getSchool
} = require('../controllers/school');

router.post('/register', registerSchool);
router.get('/get-all', getSchools);
router.get('/get', getSchool);

module.exports = router;
