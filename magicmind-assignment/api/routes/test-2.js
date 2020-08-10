'use strict';
const express = require('express');
const router = express.Router();

router.get('/test-2', (req, res, next) => {
	res.send({
		success: true,
		message: 'Hello from Test-2 Route'
	});
});

module.exports = router;
