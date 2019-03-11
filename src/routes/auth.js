const router = new (require('restify-router')).Router();
const errors = require('restify-errors');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const utils = require('../lib/utils');

router.post('/register', function (req, res, next) {
	let user = new User(req.body);

	user.save(function (err) {
		if (err)
			return next(new errors.BadRequestError(`Erro ao cadastrar usuário: ${err}`));

        return next(res.send(user));
	});
})

router.post('/auth', function (req, res, next) {
	let { email, password } = JSON.parse(utils.atob(req.body));

	if (!email || !password ) return next(new errors.BadRequestError('Erro ao efetuar autenticação: Email e/ou senha inválidos'));

	User.findOne({ email: email }, function(err, data) {
		if (err)
			return next(new errors.UnauthorizedError(err));
		if (!data)
			return next(new errors.UnauthorizedError('Erro ao efetuar autenticação: Email e/ou senha inválidos'));

		data.authenticatePassword(password, function(err, isMatch) {
			if (err || !isMatch) return next(new errors.UnauthorizedError('Erro ao efetuar autenticação: Email e/ou senha inválidos'));

			try
			{
				let token = jwt.sign(data.toJSON(), config.jwt.secret, {
					expiresIn: '45m' // token expires in 45 minutes
				});

				// retrieve issue and expiration times
				let { iat, exp } = jwt.verify(token, config.jwt.secret);

				next(res.send({
					user:  data,
					token: { iat, exp, token}
				}));
			}
			catch (ex)
			{
				next(new errors.BadRequestError(ex));
			}
		});

	});
});

module.exports = router;