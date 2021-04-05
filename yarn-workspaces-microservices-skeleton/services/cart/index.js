const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Hello from Cart Service'));

app.listen(process.env.CART_PORT, () => console.log('Cart Service is running on PORT 4002'));
