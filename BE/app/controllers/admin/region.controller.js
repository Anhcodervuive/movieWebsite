const regionService = require('../../services/region.service');
const ApiError = require('../../api-error');
const { where, Op } = require('sequelize');

class RegionController {
    constructor(regionService) {
        this.regionService = regionService;
    }

    getRegions = async (req, res, next) => {
        try {
            const { name = '' } = req.query;
            const regions = await this.regionService.getRegions({
                where: {
                    name: {
                        [Op.like]: `%${name}%`,
                    },
                },
                order: [['created_at', 'DESC']],
            });
            return res.json({ regions });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getRegion = async (req, res, next) => {
        try {
            const { id } = req.params;
            const region = await this.regionService.getRegionById(id);
            return res.json({ region });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    createRegion = async (req, res, next) => {
        try {
            const { slug } = req.body;

            const region = await this.regionService.findBySlug(slug);

            if (region) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.regionService.createRegion(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo quốc gia thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    updateRegion = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { slug } = req.body;

            const region = await this.regionService.findBySlug(slug);
            console.log(region, id);

            if (region && region?.id != id) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.regionService.updateRegion(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật quốc gia thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    deleteRegion = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.regionService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa quốc gia thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new RegionController(regionService);
