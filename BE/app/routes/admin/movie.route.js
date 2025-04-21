const express = require('express');
const router = express.Router();

const { checkLoginMiddleware } = require('../../middlewares/Auth.middleware');

const MovieController = require('../../controllers/admin/movie.controller');

router
    .route('/')
    .get(MovieController.getMovies)
    .post(checkLoginMiddleware, MovieController.createMovie);

router.get('/top-rate', MovieController.getTopRateMovies);
router.get('/top-view', MovieController.getTopViewMovies);
router.get(
    '/total-view-of-day-week-month',
    MovieController.getTotalViewOfDayMonthWeek
);

router
    .route('/:id')
    .get(MovieController.getMovieById)
    .put(checkLoginMiddleware, MovieController.updateMovie)
    .delete(checkLoginMiddleware, MovieController.deleteMovie);

module.exports = router;
