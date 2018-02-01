const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', (request, response, next) => {
	pool.query('SELECT * FROM points ORDER BY id ASC', (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.get('/:id', (request, response, next) => {
	const { id } = request.params; 

	pool.query('SELECT * FROM points WHERE id = $1', [id], (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.post('/', (request, response, next) => {
	const { name, coord, description } = request.body; 

	pool.query(
		'INSERT INTO points(name, coord, description) VALUES ($1, $2, $3)',
	 [name, coord, description], 
	 (err, res) => {
		if (err) return next(err);

		response.redirect('/points');
	});
});

router.put('/:id', (request, response, next) => {
	const { id } = request.params; 
	const keys = ['name', 'coord', 'description'];
	const fields = [];

	keys.forEach(key => {
		if (request.body[key]) fields.push(key);
	});

	fields.forEach((field, index) => {
		pool.query(
			`UPDATE points SET ${field}=($1) WHERE id=($2)`,
		 [request.body[field], id], 
		 (err, res) => {
			if (err) return next(err);

			if (index === fields.length - 1) response.redirect('/points');
		});
	});
	
});

router.delete('/:id', (request, response, next) => {
	const { id } = request.params; 

	pool.query(
		'DELETE FROM points WHERE id=($1)',
	 [id], 
	 (err, res) => {
		if (err) return next(err);

		response.redirect('/points');
	});
});

module.exports = router;