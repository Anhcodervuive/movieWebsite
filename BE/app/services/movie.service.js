const MySQL = require('../utils/mysql.util');
const {
    MovieModel,
    EpisodeModel,
    TagModel,
    RegionsModel,
} = require('../models/');
const { where, Op } = require('sequelize');
const categories = require('../models/categories.model');
const episodes = require('../models/episodes.model');
const Regions = require('../models/region.model');

const { generateMD5Hash } = require('../helpers/encrypt.help');

class MovieService {
    constructor(model) {
        this.movie = model;
    }

    extractData(payload) {
        const movie = {
            name: payload.name,
            origin_name: payload.origin_name,
            content: payload.content,
            thumb_url: payload.thumb_url,
            poster_url: payload.poster_url,
            slug: payload.slug,
            status: payload.status,
            episode_time: payload.episode_time,
            episode_current: payload.episode_current,
            episode_total: payload.episode_total,
            quality: payload.quality,
            language: payload.language,
            notify: payload.notify,
            showtimes: payload.showtimes,
            publish_year: payload.publish_year,
            is_shown_in_theater: payload.is_shown_in_theater,
            is_recommended: payload.is_recommended,
            is_sensitive_content: payload.is_sensitive_content,
            type: payload.type,
            status: payload.status,
            rating_star: payload.rating_star,
            rating_count: payload.rating_count,
        };

        Object.keys(movie).forEach((key) => {
            if (!movie[key]) delete movie[key];
        });

        return movie;
    }

    async getMovies(condition = {}) {
        return await this.movie.findAll(condition);
    }

    async getMovie(condition) {
        return await this.movie.findOne(condition);
    }

    async getMovieByTag(tag) {
        return await tag.getMovies();
    }

    async increaseView(id) {
        const movie = await this.movie.findByPk(id);

        movie.view_day += 1;
        movie.view_week += 1;
        movie.view_month += 1;
        movie.view_total += 1;

        return await movie.save();
    }

    async filter(categorieList, type = '', publishedYear = '') {
        const movies = [];
        for (let i = 0; i < categorieList.length; i++) {
            const category = categorieList[i];

            let movieModels = await category.getMovies({
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
                        model: episodes,
                        where: {
                            type: 'm3u8',
                        },
                        // limit: 2,
                    },
                    {
                        model: RegionsModel,
                    },
                ],
            });

            movieModels = movieModels.filter(
                (movie) => !movies.map((movie) => movie.id).includes(movie.id)
            );
            movies.push(...movieModels);
        }

        return movies;
    }

    async getRecommendedMovies(condition) {
        return await this.movie.findAll({
            ...condition,
            where: { is_recommended: 1 },
        });
    }

    async getMovieByIdId(id) {
        return await this.movie.findOne({ where: { id } });
    }

    async createMovie(payload) {
        const movie = this.extractData(payload);
        const {
            servers,
            regionIds,
            categorieIdS,
            actorIds,
            directorIds,
            waching_movie_packages,
        } = payload;

        const movieModel = await this.movie.create(movie);

        await movieModel.addCategories(categorieIdS);
        await movieModel.addRegions(regionIds);
        await movieModel.addActors(actorIds);
        await movieModel.addDirectors(directorIds);
        await movieModel.addWaching_movie_packages(
            waching_movie_packages.map(
                (waching_movie_package) => waching_movie_package.id
            )
        );

        // Tạo tag cho tên và tên gốc
        const tagName = await TagModel.create({
            name: movie.name,
            name_md5: generateMD5Hash(movie.name),
        });
        const tagOriginName = await TagModel.create({
            name: movie.origin_name,
            name_md5: generateMD5Hash(movie.origin_name),
        });

        await movieModel.addTags([tagName.id, tagOriginName.id]);

        for (let i = 0; i < servers.length; i++) {
            const server = servers[i];

            for (let j = 0; j < server.epsList.length; j++) {
                const episode = server.epsList[j];

                const episodeModel = await EpisodeModel.create({
                    ...episode,
                    server: server.name,
                    movie_id: movieModel.id,
                });
                await episodeModel.addWaching_movie_packages(
                    episode.waching_movie_packages.map(
                        (waching_movie_package) => waching_movie_package.id
                    )
                );
            }
        }
        return movieModel;
    }

    async updateMovie(id, payload) {
        const movie = this.extractData(payload);
        const {
            servers,
            regionIds,
            categorieIdS,
            actorIds,
            directorIds,
            waching_movie_packages,
        } = payload;
        const movieModel = await this.getMovieByIdId(id);
        await this.movie.update(movie, {
            where: {
                id,
            },
        });

        const oldEpisodes = await EpisodeModel.findAll({
            where: {
                movie_id: id,
            },
        });

        // Cập nhật tag nếu người dùng chỉnh sửa tên hoặc tên gốc
        if (movie?.name && movie?.name !== movieModel.name) {
            await TagModel.destroy({
                where: {
                    name_md5: generateMD5Hash(movieModel.name),
                },
                force: true,
            });
            const tagName = await TagModel.create({
                name: movie.name,
                name_md5: generateMD5Hash(movie.name),
            });
            await movieModel.addTags(tagName.id);
        }
        if (
            movie?.origin_name &&
            movie?.origin_name !== movieModel.origin_name
        ) {
            await TagModel.destroy({
                where: {
                    name_md5: generateMD5Hash(movieModel.origin_name),
                },
                force: true,
            });
            const tagOriginName = await TagModel.create({
                name: movie.origin_name,
                name_md5: generateMD5Hash(movie.origin_name),
            });
            await movieModel.addTags(tagOriginName.id);
        }
        if (categorieIdS) {
            await movieModel.setCategories(categorieIdS);
        }
        if (regionIds) {
            await movieModel.setRegions(regionIds);
        }

        if (actorIds) {
            await movieModel.setActors(actorIds);
        }
        if (directorIds) {
            await movieModel.setDirectors(directorIds);
        }

        if (waching_movie_packages) {
            await movieModel.setWaching_movie_packages(
                waching_movie_packages.map(
                    (waching_movie_package) => waching_movie_package.id
                )
            );
        }

        if (servers) {
            const oldEpisodeIds = oldEpisodes.map((episode) => episode.id);
            const newEpisodes = servers?.reduce((accumulator, current) => {
                return [...accumulator, ...current.epsList];
            }, []);
            const newEpisodesId = newEpisodes.map((episode) => episode.id);

            const episodeToRemoves = oldEpisodeIds.filter(
                (episodeId) => !newEpisodesId.includes(episodeId)
            );

            await EpisodeModel.destroy({
                where: {
                    id: {
                        [Op.in]: episodeToRemoves,
                    },
                },
            });
            for (let i = 0; i < servers?.length; i++) {
                const server = servers[i];

                for (let j = 0; j < server.epsList.length; j++) {
                    const episode = server.epsList[j];

                    if (!episode.id) {
                        const episodeModel = await EpisodeModel.create({
                            ...episode,
                            server: server.name,
                            movie_id: movieModel.id,
                        });
                        await episodeModel.addWaching_movie_packages(
                            episode.waching_movie_packages.map(
                                (waching_movie_package) =>
                                    waching_movie_package.id
                            )
                        );
                    } else {
                        await EpisodeModel.update(episode, {
                            where: {
                                id: episode.id,
                            },
                        });
                        const episodeModel = await EpisodeModel.findOne({
                            where: {
                                id: episode.id,
                            },
                        });
                        await episodeModel.setWaching_movie_packages(
                            episode.waching_movie_packages.map(
                                (waching_movie_package) =>
                                    waching_movie_package.id
                            )
                        );
                    }
                }
            }
        }

        return movieModel;
    }

    async increseRatingCountOfMovie(id) {}

    async deleteMovie(id) {
        const movieModel = await this.getMovieByIdId(id);
        if (movieModel) {
            await movieModel.destroy();
            const tags = await movieModel.getTags();
            for (let i = 0; i < tags.length; i++) {
                await tags[i].destroy();
            }
        }
        return movieModel;
    }
}

module.exports = new MovieService(MovieModel);
