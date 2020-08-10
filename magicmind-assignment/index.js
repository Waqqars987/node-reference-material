'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

// Route Imports
const schoolRoutes = require('./api/routes/school');
const teacherRoutes = require('./api/routes/teacher');
const studentRoutes = require('./api/routes/student');
const test1Route = require('./api/routes/test-1');
const test2Route = require('./api/routes/test-2');

const PORT = process.env.PORT || 8080;
const WHITELISTED_IP = ['::1', '::ffff:127.0.0.1', '127.0.0.1'];

/* Adding Middlwares and Routes */
// Only Allowing Request from 127.0.0.1
app.use((req, res, next) => {
	if (!WHITELISTED_IP.includes(req.ip)) {
		return res.status(403).send({
			success: false,
			message: 'IP Address Not Allowed!'
		});
	}
	next();
});

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// Main Routes
app.use('/school', schoolRoutes);
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);

// Test Routes
app.use(test1Route);
app.use(test2Route);

// Unexpected Routes Handlers (404)
app.use((req, res, next) => {
	const error = new Error('Invalid Route!');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.send({
		success: false,
		message: error.message
	});
});

// Bootstrapping the Server
mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: 300000,
		connectTimeoutMS: 30000
	})
	.then(() => {
		console.log(`MongoDB Server Connected Successfully!`);
		app.listen(PORT, () =>
			console.log(`Node Server is Running on PORT: ${PORT}`)
		);
	})
	.catch(err => {
		console.log(err);
	});
