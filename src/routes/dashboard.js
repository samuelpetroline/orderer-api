const router = new(require('restify-router')).Router();
const errors = require('restify-errors');

const Dashboard = require('../models/dashboard');

// router.get('/', function (req, res, next) {
// 	res.json({
// 		message: 'Welcome to API',
// 		query: req.query
// 	});
// 	next();
// });

router.get('/:id', function (req, res, next) {
	if (!req.params.id)
		return next(new errors.BadRequestError("ID inválido"));

	User.findById(req.params.id, function (err, user) {
		if (err) return next(new errors.BadRequestError(`Erro ao carregar o usuário: ${err}`));

		return next(res.send(user));
	});
});

router.put('/:id', function (req, res, next) {
	if (!req.params.id)
		return next(new errors.BadRequestError("ID inválido"));

	User.findOneAndUpdate({
		_id: req.params.id
	}, req.body.user, {
		upsert: true
	}, function (err, user) {
		if (err) return next(new errors.BadRequestError(`Erro ao carregar o usuário: ${err}`));

		return next(res.send(user));
	});
});

module.exports = router;