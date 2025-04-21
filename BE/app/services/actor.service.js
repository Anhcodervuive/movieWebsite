const { where, Op } = require('sequelize');
const { ActorModel } = require('../models');
const { generateMD5Hash } = require('../helpers/encrypt.help');

class ActorSerivce {
    constructor(ActorModel) {
        this.actor = ActorModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
            name_md5: generateMD5Hash(payload.name),
            slug: payload.slug,
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

    async getActors(condition) {
        return await this.actor.findAll(condition);
    }

    async findBySlug(slug) {
        return await this.actor.findOne({
            where: {
                slug,
            },
        });
    }

    async getActorById(id) {
        return await this.actor.findOne({
            where: {
                id,
            },
        });
    }

    async createActor(payload) {
        const actor = this.extractData(payload);
        return await this.actor.create(actor);
    }

    async updateActor(id, payload) {
        const actor = this.extractData(payload);
        return await this.actor.update(actor, {
            where: {
                id,
            },
        });
    }

    async deleteActor(id) {
        return await this.actor.destroy({ where: { id } });
    }
}

module.exports = new ActorSerivce(ActorModel);
