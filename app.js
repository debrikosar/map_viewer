const express = require('express');

const bodyParser = require('body-parser');
const points = require('./routes/points');
const regions = require('./routes/regions');
const login = require('./routes/login');

const app = express();

app.use(bodyParser.json());


app.use('/points', points);
app.use('/regions', regions);
app.use('/login', login);
app.use(express.static('html'));

app.use((err, req, res, next) => {
	res.json(err);
});

module.exports = app;
