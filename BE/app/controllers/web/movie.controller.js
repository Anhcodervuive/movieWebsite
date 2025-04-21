const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');

const ApiError = require('../../api-error');

const Actors = require('../../models/actor.model');
const Regions = require('../../models/region.model');
const Episode = require('../../models/episodes.model');
const Categories = require('../../models/categories.model');
const Directors = require('../../models/directors.model');
const Categories_Moive = require('../../models/category_movie.model');

const movieService = require('../../services/movie.service');
const tagService = require('../../services/tag.service');
const categoryService = require('../../services/category.service');
const ratingService = require('../../services/rating.service');
const UserWatchEpisodeSerivce = require('../../services/userWatchEpisode.service');
const VideoService = require('../../services/video.service');

const { generateMD5Hash } = require('../../helpers/encrypt.help');
const Movie = require('../../models/movie.model');
const categories = require('../../models/categories.model');
const config = require('../../config');
const Rating = require('../../models/rating.model');
const {
    UserWatchEpisode,
    EpisodeModel,
    WachingMoviePackage,
    UserModel,
} = require('../../models');
const user_has_waching_package = require('../../models/User_has_waching_package.model');
const waching_movie_package = require('../../models/waching_movie_package.model');

class MovieController {
    constructor(
        movieService,
        tagService,
        categoryService,
        ratingService,
        userWatchEpisodeSerivce,
        videoService
    ) {
        this.movieService = movieService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.ratingService = ratingService;
        this.userWatchEpisodeSerivce = userWatchEpisodeSerivce;
        this.videoService = videoService;
    }

    getMoviesByTag = async (req, res, next) => {
        try {
            const { limit = 10, tag } = req.query;
            const md5tag = generateMD5Hash(tag);
            const condition = {
                where: {
                    [Op.or]: [
                        {
                            name_md5: {
                                [Op.eq]: md5tag,
                            },
                        },
                        {
                            name: {
                                [Op.like]: `%${tag}%`,
                            },
                        },
                    ],
                },
                limit,
            };

            const tagModel = await this.tagService.getTag(condition);

            if (tagModel) {
                const movies = await this.movieService.getMovieByTag(tagModel);
                return res.json({ movies });
            } else {
                throw new Error({ code: 404, message: 'Không tìm thấy tag' });
            }
        } catch (error) {
            return next(new ApiError(error.code, error.message));
        }
    };

    filterMovie = async (req, res, next) => {
        try {
            const {
                tag: tagQuery = '',
                type = '',
                publishedYear = '',
                regionId: regionQueryId,
                categoryId: categoryQueryId,
            } = req.query;
            let categoryCondition = {};
            if (categoryQueryId) {
                categoryCondition = {
                    where: {
                        id: categoryQueryId,
                    },
                };
            }
            let regionCondition = {};
            if (regionQueryId) {
                regionCondition = {
                    where: {
                        id: regionQueryId,
                    },
                };
            }
            const movies = [];
            const relatedtags = [];
            const md5tag = tagQuery ? generateMD5Hash(tagQuery) : '';
            const condition = {
                where: {
                    [Op.or]: [
                        {
                            name_md5: {
                                [Op.eq]: md5tag,
                            },
                        },
                        {
                            name: {
                                [Op.like]: `%${tagQuery}%`,
                            },
                        },
                    ],
                },
                include: {
                    model: Movie,
                    through: {
                        attributes: [],
                    },
                    where: {
                        [Op.and]: {
                            type: {
                                [Op.like]: `%${type}%`,
                            },
                            publish_year: {
                                [Op.like]: `%${publishedYear}%`,
                            },
                        },
                    },
                    include: [
                        {
                            model: Actors,
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: categories,
                            ...categoryCondition,
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: Regions,
                            ...regionCondition,
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: Episode,
                            attributes: ['slug', 'type'],
                            where: {
                                type: 'm3u8',
                            },
                        },
                    ],
                },
            };

            const tagModel = await this.tagService.getTags(condition);
            const limit = 20;
            const limitTag = 15;
            if (tagModel.length !== 0) {
                let quantity =
                    tagModel.length < limit ? tagModel.length : limit;

                const insertedTag = [];

                if (tagModel.length === 1) {
                    await tagModel[0].increment('search_count', { by: 1 });
                    if (tagModel[0].movies.length === 1)
                        relatedtags.push(...tagModel[0].movies[0].actors);
                }

                for (let i = 0; i < quantity; i++) {
                    if (
                        tagModel[i].movies.some(
                            (movie) =>
                                !movies
                                    .map((movie) => movie.id)
                                    .includes(movie.id)
                        )
                    ) {
                        movies.push(...tagModel[i].movies);
                    }
                    relatedtags.push(tagModel[i]);
                    for (
                        let j = 0;
                        j < tagModel[i].movies.length &&
                        relatedtags.length < limitTag;
                        j++
                    ) {
                        const categoryList = tagModel[i].movies[
                            j
                        ].categories.filter(
                            (category) =>
                                !insertedTag
                                    .map((category) => category.name)
                                    .includes(category.name)
                        );
                        relatedtags.push(...categoryList);
                        insertedTag.push(...categoryList);
                    }
                }

                if (!categoryQueryId && !regionQueryId) {
                    const insertedCategories = [];

                    for (
                        let i = 0;
                        i < tagModel.length && movies.length < limit;
                        i++
                    ) {
                        for (
                            let j = 0;
                            j < tagModel[i].movies.length &&
                            movies.length < limit;
                            j++
                        ) {
                            const categories = categoryQueryId
                                ? await this.categoryService.getCategories({
                                      where: {
                                          id: categoryQueryId,
                                      },
                                  })
                                : tagModel[i].movies[j].categories.filter(
                                      (category) =>
                                          !insertedCategories
                                              .map((category) => category.name)
                                              .includes(category.name)
                                  );

                            let movieList = await this.movieService.filter(
                                categories,
                                type,
                                publishedYear
                            );

                            if (
                                tagModel.length === 1 &&
                                tagModel[0].movies.length === 1
                            ) {
                                const regions =
                                    tagModel[0].movies[0].regions.map(
                                        (region) => region.name
                                    );

                                movieList = movieList.filter((movie) =>
                                    movie.regions
                                        .map((region) => region.name)
                                        .some((regionName) =>
                                            regions.includes(regionName)
                                        )
                                );
                            }

                            movieList = movieList.filter(
                                (movie) =>
                                    !movies
                                        .map(
                                            (movielistitem) => movielistitem.id
                                        )
                                        .includes(movie.id)
                            );

                            if (movieList)
                                movies.push(
                                    ...movieList.slice(
                                        0,
                                        movieList.length > limit - movies.length
                                            ? limit - movies.length
                                            : movieList.length
                                    )
                                );
                            insertedCategories.push(categories);
                        }
                    }
                }
            } else {
                let movieByActor = await this.movieService.getMovies({
                    include: [
                        {
                            model: Categories,
                        },
                        {
                            model: Actors,
                            where: {
                                name: {
                                    [Op.like]: `%${tagQuery}%`,
                                },
                            },
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: Episode,
                            attributes: ['slug', 'type'],
                            where: {
                                type: 'm3u8',
                            },
                        },
                    ],
                    limit: limit,
                });

                const movieByActorIds = movieByActor.map((movie) => movie.id);
                // movieByActor = await this.movieService.getMovies({
                //     where: {
                //         id: movieByActorIds,
                //     },
                //     include: [
                //         {
                //             model: Categories,
                //         },
                //         {
                //             model: Actors,
                //         },
                //         {
                //             model: Episode,
                //             attributes: ['slug', 'type'],
                //             where: {
                //                 type: 'm3u8',
                //             },
                //         },
                //     ],
                //     limit: 20,
                // });

                if (movieByActor.length !== 0) {
                    movies.push(...movieByActor);
                    for (
                        let i = 0;
                        i < movieByActor.length && movies.length < 20;
                        i++
                    ) {
                        const actors = movieByActor[i].actors.filter(
                            (actor) =>
                                !relatedtags
                                    .map((actor) => actor.name)
                                    .includes(actor.name)
                        );
                        relatedtags.push(...actors);

                        const categories = movieByActor[i].categories.map(
                            (category) => category.name
                        );
                        const otherMovies = await this.movieService.getMovies({
                            include: [
                                {
                                    model: Categories,
                                    as: 'categories',
                                    where: {
                                        name: {
                                            [Op.in]: categories,
                                        },
                                    },

                                    through: {
                                        attributes: [],
                                    },
                                },
                                {
                                    model: Episode,
                                    attributes: ['slug', 'type'],
                                    where: {
                                        type: 'm3u8',
                                    },
                                },
                            ],
                            limit: 20,
                        });
                        const filterMovies = otherMovies?.filter(
                            (movie) =>
                                !movies
                                    .map((movie) => movie.name)
                                    .includes(movie.name)
                        );
                        movies.push(...filterMovies);
                    }
                } else {
                    return res.status(400).json({
                        message: 'Không tìm thấy tag',
                    });
                }
            }

            return res.json({ movies, relatedtags });
        } catch (error) {
            console.log(error.message);

            return next(new ApiError(error.code, error.message));
        }
    };

    getMoviesByCategories = async (req, res, next) => {
        try {
            const { categories: categories_slug, exceptMoiveId } = req.query;
            const user = req.user;

            const movies = await this.movieService.getMovies({
                include: [
                    {
                        model: Categories,
                        as: 'categories',
                        where: {
                            slug: {
                                [Op.in]: categories_slug,
                            },
                        },

                        through: {
                            attributes: [],
                        },
                        required: true,
                    },
                    {
                        model: EpisodeModel,
                        attributes: ['slug', 'type'],
                        where: {
                            type: {
                                [Op.like]: 'm3u8',
                            },
                        },
                        include: [
                            {
                                model: UserWatchEpisode,
                                where: {
                                    user_id: user?.id ?? null,
                                },

                                required: false,
                                // separate: true,
                            },
                        ],
                    },
                ],
                where: {
                    id: {
                        [Op.notLike]: exceptMoiveId,
                    },
                },
                group: ['id'],
                limit: 10,
            });

            return res.json({ movies });
        } catch (error) {
            return next(new ApiError(error.code, error.message));
        }
    };

    getRecommendMovies = async (req, res, next) => {
        const { limit = 10 } = req.query;
        try {
            const movies = await this.movieService.getRecommendedMovies({
                limit,
                include: [
                    {
                        model: Regions,
                        attributes: ['name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: Episode,
                        attributes: ['slug'],
                        where: {
                            type: {
                                [Op.like]: 'm3u8',
                            },
                        },
                    },
                ],
            });

            return res.json({ movies });
        } catch (error) {
            console.log(error);

            return next(new ApiError(500, error.message));
        }
    };

    getFullEpsMovie = async (req, res, next) => {
        try {
            const { slug } = req.params;
            const user = req.user;

            const movie = await this.movieService.getMovie({
                where: { slug },
                include: [
                    {
                        model: Regions,
                    },
                    {
                        model: Episode,
                        include: [
                            {
                                model: WachingMoviePackage,
                            },
                        ],
                    },
                    {
                        model: Actors,
                    },
                    {
                        model: Categories,
                    },
                    {
                        model: Directors,
                    },

                    {
                        model: Rating,
                    },
                ],
            });

            let advertises;

            if (user?.id) {
                const userModel = await UserModel.findOne({
                    where: { id: user.id },
                    include: [
                        {
                            model: WachingMoviePackage,
                            through: {
                                where: {
                                    expired_at: {
                                        [Op.gt]: new Date(), // Điều kiện: expired_at > ngày hiện tại
                                    },
                                },
                                attributes: [],
                            },
                        },
                    ],
                });

                if (userModel?.waching_movie_packages.length === 0) {
                    advertises = await this.videoService.getAll({ limit: 3 });
                }
            } else {
                advertises = await this.videoService.getAll({
                    limit: 3,
                    where: {
                        type: 'ads',
                    },
                });
            }

            return res.json({ movie, advertises });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getRate = async (req, res, next) => {
        try {
            const { movieId } = req.params;

            const movie = await this.movieService.getMovie({
                where: {
                    id: movieId,
                },
            });

            return res.json({
                avgRate: movie.rating_star,
                numberRate: movie.rating_count,
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getRateOfUser = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const { movieId } = req.params;

            const decode = jwt.verify(token, config.token.secretJWTKey);
            const userId = decode ? decode.id : null;

            const rating = await this.ratingService.getRatingByUserMovie(
                movieId,
                userId
            );

            return res.json({
                rate: rating?.star ?? 0,
            });
        } catch (error) {
            console.log(error);
            return next(new ApiError(500, error.message));
        }
    };

    rateMovie = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { movieId, star } = req.body;
            await this.ratingService.rateMovie(userId, movieId, star);

            const result = await this.ratingService.calcAvgAndSum(movieId);

            const rating_star = result.get('averageScore');
            const rating_count = result.get('rowCount');
            await this.movieService.updateMovie(movieId, {
                rating_star,
                rating_count,
            });

            return res.json({
                message: 'Cảm ơn bạn đã đánh giá',
                type: 'success',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    updateWatchedTime = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const decode = jwt.verify(token, config.token.secretJWTKey);
            const userId = decode?.id;

            const { episodeId, currentTime } = req.body;

            await this.userWatchEpisodeSerivce.createOrUpdateWatchedTime(
                userId,
                episodeId,
                currentTime
            );

            return res.json({
                message: 'Cập nhật thời gian xem thành công',
            });
        } catch (error) {
            console.log(error);
            return next(new ApiError(500, error.message));
        }
    };

    getHistory = async (req, res, next) => {
        try {
            const user = req.user;

            const watchedMovies = await this.movieService.getMovies({
                include: [
                    {
                        model: Episode,
                        include: [
                            {
                                model: UserWatchEpisode,
                                where: {
                                    user_id: user.id,
                                },
                                required: true,
                            },
                        ],
                        required: true,
                    },
                ],
                limit: 10,
            });

            return res.json({ watchedMovies: watchedMovies });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getEpisode = async (req, res, next) => {
        try {
            const { movieId, episodeSlug } = req.query;
            const user = req.user;

            const episodes = await Episode.findAll({
                where: {
                    [Op.and]: {
                        movie_id: movieId,
                        slug: episodeSlug,
                        type: 'm3u8',
                    },
                },
                include: [
                    {
                        model: UserWatchEpisode,
                        where: {
                            user_id: user?.id ?? null,
                        },
                        required: false,
                    },
                    {
                        model: waching_movie_package,
                    },
                ],
            });

            if (
                episodes.length > 0 &&
                episodes[0].waching_movie_packages.length > 0
            ) {
                if (!user) {
                    return res.json({
                        isAllowed: false,
                        message: 'Người dùng không đủ quyền',
                    });
                }

                const userModel = await UserModel.findOne({
                    where: {
                        id: user?.id,
                    },
                    include: [
                        {
                            model: WachingMoviePackage,
                        },
                    ],
                });

                const packagesOfUser = userModel?.waching_movie_packages;
                const packagesEpisodeRequire =
                    episodes[0]?.waching_movie_packages;
                const userHasAllowed = packagesOfUser.some((packageOfUser) =>
                    packagesEpisodeRequire
                        .map(
                            (packageEpisodeRequire) => packageEpisodeRequire.id
                        )
                        .includes(packageOfUser.id)
                );
                if (userHasAllowed) {
                    return res.json({ isAllowed: true, episodes });
                } else {
                    return res.json({
                        isAllowed: false,
                        message: 'Người dùng không đủ quyền',
                    });
                }
            } else {
                return res.json({ isAllowed: true, episodes });
            }
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    deleteHistory = async (req, res, next) => {
        try {
            const user = req.user;

            const { movieId } = req.params;

            const userModel = await UserModel.findByPk(user.id, {
                include: [{ model: EpisodeModel }],
            });

            const episodesNeedRemove = userModel.episodes
                .filter((episode) => episode.movie_id == movieId)
                .map((episode) => episode.id);

            await UserWatchEpisode.destroy({
                where: {
                    [Op.and]: {
                        episode_id: {
                            [Op.in]: episodesNeedRemove,
                        },
                        user_id: user.id,
                    },
                },
            });

            return res.json({
                type: 'success',
                message: 'Xóa lịch sử phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    increaseView = async (req, res, next) => {
        try {
            const { movieId } = req.body;

            await this.movieService.increaseView(movieId);

            return res.json({
                type: 'success',
                message: 'Tăng view cho movie thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new MovieController(
    movieService,
    tagService,
    categoryService,
    ratingService,
    UserWatchEpisodeSerivce,
    VideoService
);
