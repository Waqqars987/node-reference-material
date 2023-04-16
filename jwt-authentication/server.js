require('dotenv').config();

const express = require('express');
const app = express();

const { rateLimiter } = require('./middleware/rate-limiter');
const { authenticate } = require('./middleware/authenticate');

app.use(express.json());

const posts = [
	{
		username: 'Kyle',
		title: 'Post 1'
	},
	{
		username: 'Jim',
		title: 'Post 2'
	}
];

app.get('/posts', authenticate, rateLimiter, (req, res) => {
	res.json(posts);
});

app.listen(3000, () => console.log('App Server is running on PORT 3000'));
