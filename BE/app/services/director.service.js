const { where } = require('sequelize');
const { DirectorModel } = require('../models');

const { generateMD5Hash } = require('../helpers/encrypt.help');

class DirectorService {
    constructor(directorModel) {
        this.director = directorModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
            slug: payload.slug,
            name_md5: generateMD5Hash(payload.name),
            gender: payload.gender,
            bio: payload.bio,
        };

        Object.keys(data).forEach((key) => {
            if (data[key] === undefined) {
                delete data[key];
            }
        });
        return data;
    }

    async getAll(condition) {
        return await this.director.findAll(condition);
    }

    async findBySlug(slug) {
        return await this.director.findOne({
            where: {
                slug,
            },
        });
    }

    async getById(id) {
        return await this.director.findOne({
            where: {
                id,
            },
        });
    }

    async create(payload) {
        const director = this.extractData(payload);
        return await this.director.create(director);
    }

    async update(id, payload) {
        const director = this.extractData(payload);
        return await this.director.update(director, {
            where: {
                id,
            },
        });
    }

    async delete(id) {
        return await this.director.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new DirectorService(DirectorModel);
