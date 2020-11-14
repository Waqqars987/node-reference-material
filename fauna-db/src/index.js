require('dotenv').config();
const app = require('express')();
const faunadb = require('faunadb');
const client = new faunadb.Client({ secret: process.env.SECRET_KEY });

const {
	Paginate,
	Get,
	Ref,
	Select,
	Match,
	Index,
	Create,
	Collection,
	Lambda,
	Var,
	Join,
	Call,
	Function: Fn
} = faunadb.query;

app.post('/tweet', async (req, res) => {
	const data = {
		user: Call(Fn('getUser'), 'waqqar.dev'),
		text: 'Hola Muchacho!'
	};
	const doc = await client.query(Create(Collection('tweets'), { data }));
	res.send(doc);
});

app.post('/relationship', async (req, res) => {
	const data = {
		follower: Call(Fn('getUser'), 'jon'),
		followee: Call(Fn('getUser'), 'waqqar.dev')
	};
	const doc = await client.query(Create(Collection('relationships'), { data })).catch(e => console.log(e));
	res.send(doc);
});

app.get('/tweet/:id', async (req, res) => {
	const doc = await client.query(Get(Ref(Collection('tweets'), req.params.id))).catch(e => res.send(e));
	res.send(doc);
});

app.get('/tweet', async (req, res) => {
	const docs = await client.query(Paginate(Match(Index('tweets_by_user'), Call(Fn('getUser'), 'waqqar.dev'))));
	res.send(docs);
});

app.get('/feed', async (req, res) => {
	const docs = await client
		.query(
			Paginate(Join(Match(Index('followees_by_follower'), Call(Fn('getUser'), 'jon')), Index('tweets_by_user')))
		)
		.catch(e => res.send(e));

	res.send(docs);
});

app.listen(5000, () => console.log('API running...'));
