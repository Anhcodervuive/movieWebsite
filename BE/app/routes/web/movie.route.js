const express = require('express');
const router = express.Router();

const MovieController = require('../../controllers/web/movie.controller');

const {
    checkLoginMiddleware,
    autoRefreshTokenMiddleware,
} = require('../../middlewares/Auth.middleware');

router.get('/tag', MovieController.getMoviesByTag);
router.get('/filter', MovieController.filterMovie);
router.get(
    '/danh-muc',
    autoRefreshTokenMiddleware,
    MovieController.getMoviesByCategories
);
router.get('/de-xuat', MovieController.getRecommendMovies);

router.get('/get-rate/:movieId', MovieController.getRate);
router.get(
    '/get-rate-of-user/:movieId',
    checkLoginMiddleware,
    MovieController.getRateOfUser
);
router.post('/rate-movie', checkLoginMiddleware, MovieController.rateMovie);
router.post(
    '/update-watched-time',
    checkLoginMiddleware,
    MovieController.updateWatchedTime
);
router.get('/history', checkLoginMiddleware, MovieController.getHistory);
router.get(
    '/delete-history/:movieId',
    checkLoginMiddleware,
    MovieController.deleteHistory
);
router.get('/episode', autoRefreshTokenMiddleware, MovieController.getEpisode);
router.post('/increase-view', MovieController.increaseView);
router.get(
    '/:slug',
    autoRefreshTokenMiddleware,
    MovieController.getFullEpsMovie
);
module.exports = router;
