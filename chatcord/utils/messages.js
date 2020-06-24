const mooment = require('moment');

function formatMessage (username, text) {
	return {
		username,
		text,
		time     : mooment().format('h:mm a')
	};
}

module.exports = formatMessage;
