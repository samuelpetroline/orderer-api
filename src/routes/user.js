const router = new (require('restify-router')).Router();
const errors = require('restify-errors');

const User = require('../models/user');

router.get('/', function (req, res, next) {
	res.json({
		message: 'Welcome to API',
		query: req.query
	});
	next();
});

router.get('/:name', function (req, res, next) {
	res.json({
		message: `Welcome to API ${req.params.name}`,
		query: req.query
	});
	next();
});

module.exports = router;