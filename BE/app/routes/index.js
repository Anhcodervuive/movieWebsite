const adminRoute = require('./admin');
const webRoute = require('./web');
const ApiError = require('../api-error');

function route(app) {
    adminRoute(app);
    webRoute(app);

    app.use((req, res, next) => {
        return next(new ApiError(404, 'resource not found'));
    });

    app.use((err, req, res, next) => {
        return res.status(err.statusCode || 500).json({
            message: err.message || 'Internal Server Error',
        });
    });
}

module.exports = route;
