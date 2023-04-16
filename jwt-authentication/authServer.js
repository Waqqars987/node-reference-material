require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const redisClient = require('./db/redis-client');

app.use(express.json());

app.post('/login', async (req, res) => {
	const username = req.body.username;
	const user = { name: username };

	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	await redisClient.set(refreshToken, username);

	res.json({ accessToken, refreshToken });
});

app.post('/token', async (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.sendStatus(401);

	const storedRefreshToken = await redisClient.exists(refreshToken);
	if (!storedRefreshToken) return res.status(403).json({ error: 'Invalid Referesh Token' });

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		const accessToken = generateAccessToken({ name: user.name });
		res.json({ accessToken: accessToken });
	});
});

app.delete('/logout', async (req, res) => {
	await redisClient.del(req.body.token);
	res.sendStatus(204);
});

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
}

app.listen(4000, () => console.log('Auth Server is running on PORT 4000'));
