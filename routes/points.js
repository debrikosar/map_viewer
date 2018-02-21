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

router.get('/page/:page', (request, response, next) => {
	
	const { page } = request.params; 

	pool.query('SELECT * FROM points OFFSET $1 LIMIT 5', [page*5], (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.get('/count/page', (request, response, next) => {
	pool.query('SELECT COUNT (*) FROM points', (err, res) => {
		if (err) return next(err);
		response.json(res.rows);
	});
});

router.post('/', (request, response, next) => {
	const { name, coordinates, description } = request.body; 

	pool.query(
		'INSERT INTO points(name, coordinates, description) VALUES ($1, $2, $3)',
	 [name, coordinates, description], 
	 (err, res) => {
		if (err) return next(err);

		response.redirect('/points');
	});
});

router.put('/:id', (request, response, next) => {
	const { id } = request.params; 
	const keys = ['name', 'coordinates', 'description'];
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