const router = new(require('restify-router')).Router();
const errors = require('restify-errors');

const Product = require('../models/product');

router.get('/', function (req, res, next) {
    Product.find(req.query, function (err, products) {
        if (err) return next(new errors.BadRequestError(`Erro ao listar os produtos: ${err}`));

        return next(res.send(products));
    });
});

router.get('/:id', function (req, res, next) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return next(new errors.BadRequestError(`Erro ao carregar o produto: ${err}`));

        return next(res.send(product));
    });
});

router.post('/', function (req, res, next) {
    let product = new Product(req.body);
    product.save(function (err) {
        if (err) return next(new errors.BadRequestError(`Erro ao cadastrar produto: ${err}`));

        return next(res.send(product));
    });
});

router.del('/:id', function (req, res, next) {
    Product.deleteOne({
        _id: req.params.id
    }, function (err) {
        if (err) return next(new errors.BadRequestError(`Erro ao deletar produto: ${err}`));

        return next(res.send("Deletado com sucesso!"));
    })
});

module.exports = router;