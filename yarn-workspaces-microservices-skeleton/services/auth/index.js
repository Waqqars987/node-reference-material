const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const express = require('express');

const dbFunction = require('@mmt/database');

const app = express();

// Using portions of a shared module
dbFunction();

app.get('/', (req, res) => res.send('Hello from Auth Service'));

app.listen(process.env.AUTH_PORT, () => console.log('Auth Service is running on PORT 4000'));
