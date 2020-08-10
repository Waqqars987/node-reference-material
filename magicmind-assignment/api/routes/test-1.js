'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/test-1', async (req, res, next) => {
	// Calling Test-2 Route from inside Test-1 Route
	const test2RouteResponse = await axios.get(
		`http://localhost:${process.env.PORT || 8080}/test-2`
	);
	res.send({
		'test-1-response': {
			success: true,
			message: 'Hello from Test-1 Route'
		},
		'test-2-response': test2RouteResponse.data
	});
});

module.exports = router;
