const redis = require('redis');
const config = require('../config');
class redisClient {
    static connect() {
        if (this.client) return this.client;
        this.client = redis.createClient({
            url: config.redis.link,
            socket: {
                // tls: true,
            },
        });
        this.client.connect();
        this.client.on('error', (err) => {
            console.error('Error connecting to Redis:', err);
        });
        this.client.on('connect', () => {
            console.log('Connected to Redis');
        });

        return this.client;
    }
}

module.exports = redisClient;
