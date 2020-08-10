'use strict';
const express = require('express');
const router = express.Router();

const { addStudentData, getAllStudentData } = require('../controllers/student');
const checkAuth = require('../middleware/check-auth');

// Route protected by Auth Middleware
router.post('/add-data', checkAuth, addStudentData);

// Route NOT protected by Auth Middleware
router.get('/get-all', getAllStudentData);

module.exports = router;
