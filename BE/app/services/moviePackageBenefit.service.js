const { where } = require('sequelize');
const { MoviePackageBenefit } = require('../models');

class MoviePackageBenefitService {
    constructor(moviePackageBenefitModel) {
        this.moviePackageBenefit = moviePackageBenefitModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
        };

        return data;
    }

    async getAll(condition) {
        return await this.moviePackageBenefit.findAll(condition);
    }

    async getById(id) {
        return await this.moviePackageBenefit.findOne({
            where: {
                id,
            },
        });
    }

    async create(payload) {
        const moviePackageBenefit = this.extractData(payload);
        return await this.moviePackageBenefit.create(moviePackageBenefit);
    }

    async update(id, payload) {
        const moviePackageBenefit = this.extractData(payload);
        return await this.moviePackageBenefit.update(moviePackageBenefit, {
            where: {
                id,
            },
        });
    }

    async delete(id) {
        return await this.moviePackageBenefit.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new MoviePackageBenefitService(MoviePackageBenefit);
