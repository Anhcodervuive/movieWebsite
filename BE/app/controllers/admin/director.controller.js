const directorService = require('../../services/director.service');
const ApiError = require('../../api-error');
const { where, Op } = require('sequelize');

class DirectorController {
    constructor(directorService) {
        this.directorService = directorService;
    }

    getAll = async (req, res, next) => {
        try {
            const { name = '' } = req.query;
            const directors = await this.directorService.getAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`,
                    },
                },
                order: [['created_at', 'DESC']],
            });
            return res.json({ directors });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const director = await this.directorService.getById(id);
            return res.json({ director });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    create = async (req, res, next) => {
        try {
            const { slug } = req.body;

            const director = await this.directorService.findBySlug(slug);

            if (director) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.directorService.create(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo đạo diễn thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { slug } = req.body;

            const director = await this.directorService.findBySlug(slug);
            console.log(director, id);

            if (director && director?.id != id) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.directorService.update(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật đạo diễn thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.directorService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa đạo diễn thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new DirectorController(directorService);
