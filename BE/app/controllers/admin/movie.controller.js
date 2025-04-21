const movieService = require('../../services/movie.service');
const ApiError = require('../../api-error');
const { where, Op } = require('sequelize');
const {
    CategoriesModel,
    RegionsModel,
    EpisodeModel,
    RatingModel,
    MovieModel,
} = require('../../models');
const { NavLink } = require('react-router-dom');
const actors = require('../../models/actor.model');
const directors = require('../../models/directors.model');
const categories = require('../../models/categories.model');
const waching_movie_package = require('../../models/waching_movie_package.model');

class MovieController {
    constructor(movieService) {
        this.movieService = movieService;
    }

    getMovies = async (req, res, next) => {
        try {
            const {
                name = '',
                status = '',
                type = '',
                categoryId = '',
                regionId = '',
            } = req.query;

            let whereCategoryCondition = {};
            if (categoryId) {
                whereCategoryCondition = { where: { id: categoryId } };
            }
            let whereRegionCondition = {};
            if (regionId) {
                whereRegionCondition = { where: { id: regionId } };
            }
            const movies = await this.movieService.getMovies({
                where: {
                    [Op.and]: {
                        name: {
                            [Op.like]: `%${name}%`,
                        },
                        status: {
                            [Op.like]: `%${status}%`,
                        },
                        type: {
                            [Op.like]: `%${type}%`,
                        },
                    },
                },
                include: [
                    {
                        model: CategoriesModel,
                        as: 'categories',
                        ...whereCategoryCondition,
                    },
                    {
                        model: RegionsModel,
                        ...whereRegionCondition,
                    },
                ],
                order: [['updated_at', 'DESC']],
            });
            return res.json({ movies: movies });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getMovieById = async (req, res, next) => {
        try {
            const movie = await this.movieService.getMovie({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        model: actors,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: directors,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: categories,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: RegionsModel,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: EpisodeModel,
                        attributes: [
                            'id',
                            'name',
                            'slug',
                            'server',
                            'type',
                            'link',
                            'movie_id',
                        ],
                        include: [
                            {
                                model: waching_movie_package,
                                through: {
                                    attributes: [],
                                },
                            },
                        ],
                    },
                    {
                        model: waching_movie_package,
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });
            return res.json({ movie });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    createMovie = async (req, res, next) => {
        try {
            await this.movieService.createMovie(req.body);
            return res.json({
                type: 'success',
                message: 'Thêm phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    updateMovie = async (req, res, next) => {
        try {
            const movie = await this.movieService.updateMovie(
                req.params.id,
                req.body
            );
            return res.json({
                type: 'success',
                message: 'Cập nhật phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    deleteMovie = async (req, res, next) => {
        try {
            const movie = await this.movieService.deleteMovie(req.params.id);
            return res.json({
                type: 'success',
                message: 'Xóa phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getTopRateMovies = async (req, res, next) => {
        try {
            const movies = await this.movieService.getMovies({
                order: [
                    ['rating_count', 'DESC'], // Sắp xếp theo trường A (ưu tiên cao hơn)
                    ['rating_star', 'DESC'], // Sau đó sắp xếp theo trường B
                ],
                attributes: [
                    'id',
                    'name',
                    'thumb_url',
                    'view_total',
                    'rating_count',
                    'rating_star',
                ],
                include: [
                    {
                        model: RatingModel,
                        required: false,
                    },
                ],
                limit: 5,
            });

            return res.json({ movies });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getTopViewMovies = async (req, res, next) => {
        try {
            const { type = 'view_total' } = req.query;
            const movies = await this.movieService.getMovies({
                order: [[type, 'DESC']],
                limit: 10,
            });

            return res.json({ movies });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getTotalViewOfDayMonthWeek = async (req, res, next) => {
        try {
            const totalViewTotal = await MovieModel.sum('view_total');
            const totalViewMonth = await MovieModel.sum('view_month');
            const totalViewDay = await MovieModel.sum('view_day');
            const totalViewWeek = await MovieModel.sum('view_week');

            return res.json({
                totalViewTotal,
                totalViewMonth,
                totalViewDay,
                totalViewWeek,
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new MovieController(movieService);
