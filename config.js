const env = process.env.NODE_ENV || 'development';
const dbConnectionUrl = process.env.MONGODB_URL || 'mongodb://localhost/';

const config = {
    development: {
        app: {
            name: 'orderer-api-dev'
        },
        ip: process.env.IP || '127.0.0.1',
        port: process.env.PORT || 8080,
        db: dbConnectionUrl + 'orderer-api-dev'
    },

    production: {
        app: {
            name: 'orderer-api-prod'
        },
        ip: process.env.IP || '127.0.0.1',
        port: process.env.PORT || 8080,
        db: dbConnectionUrl + 'orderer-api-prod'
    }
};

module.exports = config[env];