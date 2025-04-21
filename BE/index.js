const app = require('./app');
const config = require('./app/config');
const MySQL = require('./app/utils/mysql.util');
const redisClient = require('./app/utils/redis.util');
(function startServer() {
    try {
        MySQL.connect();
        redisClient.connect();
        const PORT = config.app.port || 3003;
        app.listen(PORT, () => {
            console.log(`server runing on localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
})();
