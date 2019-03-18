const restify = require('restify');
const mongoose = require('mongoose');
const jwt = require('restify-jwt-community');
const router = new(require('restify-router')).Router();

const server = restify.createServer({
	name: 'orderer-api',
	version: '1.0.0',
});

const jwtConfig = require('./config.json');
const config = require('./config');
const logger = require('./basic-logger');

server.use(jwt(jwtConfig.jwt).unless({
	path: [
		config.basePath('/auth'),
		config.basePath('/register')
	]
}))

const auth = require('./src/routes/auth');
const order = require('./src/routes/order');
const product = require('./src/routes/product');
const user = require('./src/routes/user');
const dashboard = require('./src/routes/dashboard');

//#region Database
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {
	useNewUrlParser: true,
	useCreateIndex: true
});

let db = mongoose.connection;
db.on('error', function () {
	throw new Error(`Unnable to connect to database ${config.db}`);
})
//#endregion

//#region Server
server.use(restify.plugins.throttle({
	burst: 100, // Max 10 concurrent requests (if tokens)
	rate: 2, // Steady state: 2 request / 1 seconds
	ip: true, // throttle per IP
}));

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());

server.use(
	function crossOrigin(req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
		return next();
	}
);

router.add('/api', auth);
router.add('/api/orders', order);
router.add('/api/products', product);
router.add('/api/users', user);
router.add('/api/dashboard', dashboard);
router.applyRoutes(server);

server.on('after', restify.plugins.metrics({
	server: server
}, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(8080, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});
//#endregion