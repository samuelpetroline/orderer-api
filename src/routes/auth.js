const router = new (require('restify-router')).Router();

router.post('/auth', function (req, res, next) {
	res.json({
		message: `Welcome to API ${req.body.name}`,
		query: req.query
	});
	next();
});

module.exports = router;