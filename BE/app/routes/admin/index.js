const MovieRoute = require('./movie.route');
const CatalogRoute = require('./catalog.route');
const ActorRoute = require('./actor.route');
const CategoryRoute = require('./category.route');
const RegionRoute = require('./region.route');
const DirectorRoute = require('./director.route');
const VideoRoute = require('./video.route');
const MoviePackageBenefitRoute = require('./moviePackageBenefit.route');
const WachingMoviePackageRoute = require('./wachingMoviePackage.route');
const BillRoute = require('./bill.route');
const UserRoute = require('./user.route');
const RoleRoute = require('./role.route');
const PermissionRoute = require('./permission.route');

const {
    checkLoginMiddleware,
    isHaveRoles,
} = require('../../middlewares/Auth.middleware');

function adminRoute(app) {
    app.use('/api/admin/phim', MovieRoute);
    app.use('/api/admin/catalog', CatalogRoute);
    app.use('/api/admin/user', UserRoute);
    app.use(
        '/api/admin/actor',
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        ActorRoute
    );
    app.use(
        '/api/admin/category',
        // checkLoginMiddleware,
        // isHaveRoles(['Admin']),
        CategoryRoute
    );
    app.use(
        '/api/admin/region',
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        RegionRoute
    );
    app.use(
        '/api/admin/director',
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        DirectorRoute
    );
    app.use(
        '/api/admin/video',
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        VideoRoute
    );
    app.use(
        '/api/admin/movie-Package-Benefit',
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        MoviePackageBenefitRoute
    );
    app.use(
        '/api/admin/waching-Movie-Package',
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        WachingMoviePackageRoute
    );
    app.use(
        '/api/admin/bill',
        // checkLoginMiddleware,
        // isHaveRoles(['Admin']),
        BillRoute
    );
    app.use(
        '/api/admin/role',
        // checkLoginMiddleware,
        // isHaveRoles(['Admin']),
        RoleRoute
    );
    app.use(
        '/api/admin/permission',
        // checkLoginMiddleware,
        // isHaveRoles(['Admin']),
        PermissionRoute
    );
}

module.exports = adminRoute;
