const { where } = require('sequelize');
const { content_sections_model } = require('../models');

class contentSectionService {
    constructor(contentsectionModel) {
        this.contentSection = contentsectionModel;
    }
    extractData(payload) {
        const data = {
            name: payload.name,
            type: payload.type,
            catalog_id: payload.catalog_id,
        };

        return data;
    }

    async createContentSection(payload) {
        const data = this.extractData(payload);

        return await this.contentSection.create(data);
    }

    async deleteContentSectionByCatalog(catalogId) {
        return await this.contentSection.destroy({
            where: {
                catalog_id: catalogId,
            },
        });
    }
}

module.exports = new contentSectionService(content_sections_model);
