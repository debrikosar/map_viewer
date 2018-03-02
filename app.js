const express = require('express');
const bodyParser = require('body-parser');
const points = require('./routes/points');
const regions = require('./routes/regions');

const app = express();

app.use(bodyParser.json());
app.use('/points', points);
app.use('/regions', regions);
app.use(express.static('html'));

app.use((err, req, res, next) => {
	res.json(err);
});

module.exports = app;
