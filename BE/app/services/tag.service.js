const { where, Op } = require('sequelize');
const { TagModel } = require('../models');

const { generateMD5Hash } = require('../helpers/encrypt.help');

class TagSerivce {
    constructor(tagModel) {
        this.tag = tagModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
            name_md5: payload.name ? generateMD5Hash(payload.name) : null,
            slug: payload.slug,
            language: payload.language,
            search_count: payload.search_count,
        };

        Object.keys(data).forEach((key) => {
            if (!data[key]) delete data[key];
        });

        return data;
    }

    async getTag(condition) {
        return await this.tag.findOne(condition);
    }

    async getTags(condition) {
        return await this.tag.findAll(condition);
    }

    async getRecommendedTags(limit = 6) {
        return await this.tag.findAll({
            order: [['search_count', 'DESC']],
            limit: limit,
        });
    }

    async update(id, payload) {
        const tag = this.extractData(payload);
        return await this.tag.update(tag, {
            where: {
                id,
            },
        });
    }
}

module.exports = new TagSerivce(TagModel);
