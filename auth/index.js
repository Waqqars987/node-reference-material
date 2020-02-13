const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
dotenv.config();

const PORT = 3000;
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('Connected to DB!')
);

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

app.listen(PORT, () => {
    console.log(`Node server is listening on ${PORT}.`);
});