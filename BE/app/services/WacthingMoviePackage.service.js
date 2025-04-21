const { where } = require('sequelize');
const { WachingMoviePackage } = require('../models');
const movie_package_benefit = require('../models/movie_package_benefit.model');
const { Await } = require('react-router-dom');

class WacthingMoviePackageService {
    constructor(wachingMoviePackageModel) {
        this.wachingMoviePackage = wachingMoviePackageModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
            expiresIn: payload.expiresIn,
            price: payload.price,
            discount: payload.discount,
        };

        Object.keys(data).forEach((key) => {
            if (data[key] === undefined) {
                delete data[key];
            }
        });

        return data;
    }

    async getAll(condition) {
        return await this.wachingMoviePackage.findAll(condition);
    }

    async getById(id) {
        return await this.wachingMoviePackage.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: movie_package_benefit,
                    attributes: ['id', 'name'],
                },
            ],
        });
    }

    async create(payload) {
        const { moviePackageBenefitIds } = payload;
        const wachingMoviePackage = this.extractData(payload);

        const wachingMoviePackageModel = await this.wachingMoviePackage.create(
            wachingMoviePackage
        );

        if (moviePackageBenefitIds?.length > 0) {
            await wachingMoviePackageModel.addMovie_package_benefits(
                moviePackageBenefitIds
            );
        }

        return wachingMoviePackageModel;
    }

    async update(id, payload) {
        const { moviePackageBenefitIds } = payload;
        const wachingMoviePackage = this.extractData(payload);
        await this.wachingMoviePackage.update(wachingMoviePackage, {
            where: {
                id,
            },
        });
        const wachingMoviePackageModel = await this.getById(id);
        await wachingMoviePackageModel.setMovie_package_benefits(
            moviePackageBenefitIds
        );

        return wachingMoviePackageModel;
    }

    async enable(id) {
        return await this.wachingMoviePackage.update(
            { disable: 0 },
            {
                where: {
                    id,
                },
            }
        );
    }

    async disable(id) {
        return await this.wachingMoviePackage.update(
            { disable: 1 },
            {
                where: {
                    id,
                },
            }
        );
    }

    async delete(id) {
        return await this.wachingMoviePackage.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new WacthingMoviePackageService(WachingMoviePackage);
