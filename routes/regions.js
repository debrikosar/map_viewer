const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', (request, response, next) => {
	pool.query('SELECT * FROM regions', (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.get('/id:id', (request, response, next) => {
	
	const { id } = request.params; 

	pool.query('SELECT * FROM regions WHERE id = $1', [id], (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});


router.get('/located', (request, response, next) => {
	pool.query('SELECT * FROM short_points JOIN regions ON short_points.region_id = regions.id', (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.get('/count', (request, response, next) => {
	pool.query('SELECT COUNT (*) FROM regions', (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});


router.get('/short', (request, response, next) => {
	pool.query('SELECT * FROM short_points', (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.get('/short/region:id', (request, response, next) => {
	
	const { id } = request.params; 

	pool.query('SELECT * FROM short_points WHERE region_id = $1', [id], (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});


router.post('/', (request, response, next) => {
	const { name, description } = request.body; 

	pool.query(
		'INSERT INTO regions(name, description) VALUES ($1, $2) RETURNING id',
	 [name, description], 
	 (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.post('/short', (request, response, next) => {
	const { region_id, coordinates } = request.body; 

	pool.query(
		'INSERT INTO short_points (region_id, coordinates) VALUES ($1, $2)',
	 [region_id, coordinates], 
	 (err, res) => {
		if (err) return next(err);

		response.json(res.rows);
	});
});

router.post('/complex', (request, response, next) => {
	const { name, description, points} = request.body;

	saveRegions();
	response.json(res.rows);

	function saveRegions() {
		pool.query(
			'INSERT INTO regions(name, description) VALUES ($1, $2) RETURNING id',
	 	[name, description], 
	 	(err, res) => {
			if (err) return next(err);

			savePoints(res.rows[0].id);
		});
	}

	function savePoints(region_id){
		for(let i = 0; i < points.length; i++){
			pool.query(
				'INSERT INTO short_points(region_id, coordinates) VALUES ($1, $2)',
	 			[region_id, points[i]], 
	 			(err, res) => {
					if (err) return next(err);
				});
		}
	}
});

router.put('/:id', (request, response, next) => {
	const { id } = request.params; 
	const keys = ['name', 'description'];
	const fields = [];

	keys.forEach(key => {
		if (request.body[key]) fields.push(key);
	});

	fields.forEach((field, index) => {
		pool.query(
			`UPDATE regions SET ${field}=($1) WHERE id=($2)`,
		 [request.body[field], id], 
		 (err, res) => {
			if (err) return next(err);

			
		});
	});
	response.json(res.rows);
});

router.put('/short/:id', (request, response, next) => {
	const { id } = request.params; 
	const keys = ['region_id', 'coordinates'];
	const fields = [];

	keys.forEach(key => {
		if (request.body[key]) fields.push(key);
	});

	fields.forEach((field, index) => {
		pool.query(
			`UPDATE short_points SET ${field}=($1) WHERE id=($2)`,
		 [request.body[field], id], 
		 (err, res) => {
			if (err) return next(err);

			
		});
	});
	response.json(res.rows);
});


router.delete('/:id', (request, response, next) => {
	const { id } = request.params; 

	pool.query(
		'DELETE FROM regions WHERE id=($1)',
	 [id], 
	 (err, res) => {
		if (err) return next(err);
	});
	response.json(res.rows);
});

router.delete('/short/:id', (request, response, next) => {
	const { id } = request.params; 

	pool.query(
		'DELETE FROM short_points WHERE id=($1)',
	 [id], 
	 (err, res) => {
		if (err) return next(err);
	});
	response.json(res.rows);
});


module.exports = router;

