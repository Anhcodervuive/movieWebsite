const actorService = require('../../services/actor.service');
const ApiError = require('../../api-error');
const { Op } = require('sequelize');

class ActorController {
    constructor(actorService) {
        this.actorService = actorService;
    }

    getActors = async (req, res, next) => {
        try {
            const { name = '' } = req.query;
            const actors = await this.actorService.getActors({
                where: {
                    name: {
                        [Op.like]: `%${name}%`,
                    },
                },
                order: [['created_at', 'DESC']],
            });
            return res.json({ actors });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getActor = async (req, res, next) => {
        try {
            const { id } = req.params;
            const actor = await this.actorService.getActorById(id);
            return res.json({ actor });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    createActor = async (req, res, next) => {
        try {
            const { slug } = req.body;

            const actor = await this.actorService.findBySlug(slug);

            if (actor) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.actorService.createActor(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo diễn viên thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    updateMovie = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { slug } = req.body;

            const actor = await this.actorService.findBySlug(slug);

            if (actor && actor?.id != id) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.actorService.updateActor(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật diễn viên thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    deleteActor = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.actorService.deleteActor(id);
            return res.json({
                type: 'success',
                message: 'Xóa diễn viên thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new ActorController(actorService);
