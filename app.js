const express = require('express');
const bodyParser = require('body-parser');
const points = require('./routes/points');

const app = express();

app.use(bodyParser.json());
app.use('/points', points);
app.use(express.static('html'));

app.use((err, req, res, next) => {
	res.json(err);
});

module.exports = app;
