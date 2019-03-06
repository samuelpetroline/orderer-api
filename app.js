const restify = require('restify');
const mongoose = require('mongoose');
const jwt = require('restify-jwt-community');
const router = new (require('restify-router')).Router();

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

//#region Database
console.log(config);
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', function() {
	throw new Error(`Unnable to connect to database ${config.db}`);
})

db.on('all', function(event, listener) {
	console.log(event, listener);
});
//#endregion

//#region Server
server.use(restify.plugins.throttle({
	burst: 100,  	// Max 10 concurrent requests (if tokens)
	rate: 2,  		// Steady state: 2 request / 1 seconds
	ip: true,		// throttle per IP
}));

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());

router.add('/api', auth);
router.add('/api/order', order);
router.add('/api/product', product);
router.add('/api/user', user);
router.applyRoutes(server);

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(8080, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});
//#endregion