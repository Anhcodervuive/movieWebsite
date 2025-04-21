const regionService = require('../../services/region.service');
const ApiError = require('../../api-error');
const { where, Op } = require('sequelize');

class BillController {
    constructor(regionService) {
        this.regionService = regionService;
    }

    getAll = async (req, res, next) => {
        try {
            const regions = await this.regionService.getRegions({});
            return res.json({ regions });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new BillController(regionService);
