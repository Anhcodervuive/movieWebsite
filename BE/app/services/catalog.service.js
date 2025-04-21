const { where } = require('sequelize');
const { CatalogModel } = require('../models');

class catalogService {
    constructor(catalogModel) {
        this.catalog = catalogModel;
    }
    extractData(payload) {
        const data = {
            name: payload.name,
            slug: payload.slug,
        };

        return data;
    }

    async getCatalog(condition) {
        return await this.catalog.findOne(condition);
    }

    async getCatalogs(condition = {}) {
        return await this.catalog.findAll(condition);
    }

    async createCatalog(payload) {
        const data = this.extractData(payload);

        return await this.catalog.create(data);
    }

    async updateCatalog(payload, id) {
        const data = this.extractData(payload);

        return await this.catalog.update(data, {
            where: {
                id: id,
            },
        });
    }

    async deleteCatalog(id) {
        return await this.catalog.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new catalogService(CatalogModel);
