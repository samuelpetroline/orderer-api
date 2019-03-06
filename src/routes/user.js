const router = new (require('restify-router')).Router();
const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

const config = require('../../config.json');

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

router.post('/', function (req, res, next) {
	let user = new User(req.body);

	user.save(function(err) {
		if (err) return next(new errors.BadRequestError(`Erro ao cadastrar usuário: ${err}`));

        return next(res.send(user));
	})
});

router.post('/auth', function (req, res, next) {
	let { email, password } = req.body;
	if (!email || !password ) return next(new errors.BadRequestError('Erro ao efetuar autenticação: Email e/ou senha inválidos'));

	User.findOne({ email: email }, function(err, data) {
		if (err) return next(new errors.UnauthorizedError(err));
		if (!data) return next(new errors.UnauthorizedError('Erro ao efetuar autenticação: Email e/ou senha inválidos'));

		data.authenticatePassword(password, function(err, isMatch) {
			if (err || !isMatch) return next(new errors.UnauthorizedError('Erro ao efetuar autenticação: Email e/ou senha inválidos'));

			let token = jwt.sign(data.toJSON(), config.jwt.secret, {
				expiresIn: '15m' // token expires in 15 minutes
			});

			// retrieve issue and expiration times
			let { iat, exp } = jwt.decode(token);
			next(res.send({ iat, exp, token }));
		})
	})
});

module.exports = router;