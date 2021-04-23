const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: String,
	hash: String,
	salt: String,
	role: String,
});

mongoose.model('User', UserSchema);
