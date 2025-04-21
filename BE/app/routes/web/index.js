const AuthRoute = require('./Auth.route');
const MovieRoute = require('./movie.route');
const TagRoute = require('./Tag.route');
const CataglogRoute = require('./Catalog.route');
const WachingMovePackageRoute = require('./WachingMovePackage.route');
const BillRoute = require('./bill.route');
const RegionRoute = require('./regions.route');
const CategoryRoute = require('./category.route');

function webRoute(app) {
    app.use('/api', AuthRoute);
    app.use('/api/phim', MovieRoute);
    app.use('/api/tag', TagRoute);
    app.use('/api/catalog', CataglogRoute);
    app.use('/api/waching-movie-package', WachingMovePackageRoute);
    app.use('/api/bill', BillRoute);
    app.use('/api/region', RegionRoute);
    app.use('/api/category', CategoryRoute);
}

module.exports = webRoute;
