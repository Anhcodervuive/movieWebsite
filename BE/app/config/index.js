require('dotenv').config();

const config = {
    app: {
        port: process.env.APP_PORT || 3000,
    },
    client: process.env.CLIENT,
    db: {
        port: process.env.DB_PORT || 3000,
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        name: process.env.DB_NAME || '',
    },
    redis: {
        link: process.env.REDIS_URL,
    },
    mail: {
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
    },
    token: {
        secretJWTKey: process.env.JWT_SECRET_KEY,
        secretJWTRefreshKey: process.env.JWT_SECRET_REFRESH_KEY,
        exp: process.env.TOKEN_EXP,
        refreshExp: process.env.REFRESH_TOKEN_EXP,
    },
    cookie: {
        exp: process.env.COOKIE_EXP,
    },
    vnPay: {
        TmnCode: process.env.VNP_TMNCODE,
        HashSecret: process.env.VNP_HASHSECRET,
        url: process.env.VNP_URL,
        api: process.env.VNP_API,
        returnUrl: (userId, packageId) =>
            `${process.env.VNP_RETURNURL}/${userId}/${packageId}/`,
    },
};

module.exports = config;
