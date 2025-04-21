const { where } = require('sequelize');
const { RegionsModel } = require('../models');

class RegionService {
    constructor(regionModel) {
        this.region = regionModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
            slug: payload.slug,
        };

        return data;
    }

    async getRegions(condition) {
        return await this.region.findAll(condition);
    }

    async findBySlug(slug) {
        return await this.region.findOne({
            where: {
                slug,
            },
        });
    }

    async getRegionById(id) {
        return await this.region.findOne({
            where: {
                id,
            },
        });
    }

    async createRegion(payload) {
        const region = this.extractData(payload);
        return await this.region.create(region);
    }

    async updateRegion(id, payload) {
        const region = this.extractData(payload);
        return await this.region.update(region, {
            where: {
                id,
            },
        });
    }

    async delete(id) {
        return await this.region.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new RegionService(RegionsModel);
