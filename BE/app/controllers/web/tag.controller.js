const { Op, where } = require('sequelize');

const tagService = require('../../services/tag.service');
const actorService = require('../../services/actor.service');

const ApiError = require('../../api-error');
const { generateMD5Hash } = require('../../helpers/encrypt.help');

class TagController {
    constructor(tagService, actorService) {
        this.tagService = tagService;
        this.actorService = actorService;
    }

    getRecommendedTag = async (req, res, next) => {
        try {
            const tags = await this.tagService.getRecommendedTags();
            return res.json({ tags });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    findTags = async (req, res, next) => {
        try {
            const { limit = 10, tag } = req.query;
            const md5tag = generateMD5Hash(tag);
            const tags = [];
            const tagModel = await this.tagService.getTags({
                where: {
                    [Op.or]: [
                        {
                            name_md5: {
                                [Op.eq]: md5tag,
                            },
                        },
                        {
                            name: {
                                [Op.like]: `%${tag}%`,
                            },
                        },
                    ],
                },
                limit,
            });
            if (tagModel.length !== 0) {
                tags.push(...tagModel);
            } else {
                const actors = await this.actorService.getActors({
                    where: {
                        name: {
                            [Op.like]: `%${tag}%`,
                        },
                    },
                    limit,
                });
                tags.push(...actors);
            }
            return res.json({ tags });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new TagController(tagService, actorService);
