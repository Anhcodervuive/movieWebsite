const { where } = require('sequelize');
const Video = require('../models/video.model');

class VideoService {
    constructor(videoModel) {
        this.video = videoModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
            url: payload.url,
            type: payload.type,
        };

        Object.keys(data).forEach((key) => {
            if (data[key] === undefined) {
                delete data[key];
            }
        });

        return data;
    }

    async getAll(condition) {
        return await this.video.findAll(condition);
    }

    async findBySlug(slug) {
        return await this.video.findOne({
            where: {
                slug,
            },
        });
    }

    async getById(id) {
        return await this.video.findOne({
            where: {
                id,
            },
        });
    }

    async create(payload) {
        const video = this.extractData(payload);
        return await this.video.create(video);
    }

    async update(id, payload) {
        const video = this.extractData(payload);
        return await this.video.update(video, {
            where: {
                id,
            },
        });
    }

    async delete(id) {
        return await this.video.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new VideoService(Video);
