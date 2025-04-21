import routes from './routes';

const config = {
    routes,
    apiServer: 'http://localhost:3003',
    auth: {
        expLogin: process.env.EXP_LOGIN,
        expRememberLogin: process.env.EXP_REMEMBER_LOGIN,
    },
};

export default config;
