const config = require('../config');
const slugify = require('slugify');
const { Sequelize } = require('sequelize');

class MySQL {
    static connect() {
        if (this.client) return this.client;
        this.client = new Sequelize(
            config.db.name,
            config.db.user,
            config.db.password,
            {
                host: config.db.host,
                dialect: 'mysql',
                port: config.db.port,
                logging: false,
            }
        );
        this.client
            .authenticate()
            .then(() => console.log('✅ DB connected'))
            .catch((err) => {
                console.error('❌ DB connection error:', err);
            });
        return this.client;
    }
}

module.exports = MySQL;
