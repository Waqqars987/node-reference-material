const redisClient = require('../db/redis-client');

const MAX_REQUEST_LIMIT = 5;
const RESET_WINDOW = 30;

module.exports.rateLimiter = async (req, res, next) => {
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const requests = await redisClient.incr(ip);

	if (requests === 1) {
		await redisClient.expire(ip, RESET_WINDOW);
	}

	if (requests > MAX_REQUEST_LIMIT) {
		return res.sendStatus(429);
	}

	next();
};
