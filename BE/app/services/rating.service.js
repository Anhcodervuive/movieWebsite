const { where, Op, fn, col } = require('sequelize');
const { RatingModel } = require('../models');

class RangtingSerivce {
    constructor(ratingModel) {
        this.rating = ratingModel;
    }

    async getRatingByUserMovie(moiveId, userId) {
        return await this.rating.findOne({
            where: {
                [Op.and]: {
                    movie_id: moiveId,
                    user_id: userId,
                },
            },
        });
    }

    async rateMovie(userId, movieId, star) {
        const rating = await this.rating.findOne({
            where: {
                [Op.and]: {
                    user_id: userId,
                    movie_id: movieId,
                },
            },
        });

        if (rating) {
            return await rating.update({
                star,
            });
        } else {
            return await this.rating.create({
                user_id: userId,
                movie_id: movieId,
                star,
            });
        }
    }

    async calcAvgAndSum(movieId) {
        return await this.rating.findOne({
            attributes: [
                [fn('AVG', col('star')), 'averageScore'],
                [fn('COUNT', col('id')), 'rowCount'],
            ],
            where: {
                movie_id: movieId,
            },
        });
    }
}

module.exports = new RangtingSerivce(RatingModel);
