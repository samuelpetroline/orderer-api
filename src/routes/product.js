const router = new(require('restify-router')).Router();
const errors = require('restify-errors');

const Product = require('../models/product');

router.get('/', function (req, res, next) {
    res.json({
        message: 'Welcome to product',
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
     var product = new Product(req.body);

    product.save(function(err) {
        if (err) return next(new errors.BadRequestError(`Erro ao cadastrar produto: ${err}`));

        return next(res.send(product));
    })
});

router.del('/:id', function (req, res, next) {

    next();
});

module.exports = router;