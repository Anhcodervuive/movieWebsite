const categoryService = require('../../services/category.service');
const ApiError = require('../../api-error');
const { where, Op } = require('sequelize');

class BillController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    getAll = async (req, res, next) => {
        try {
            const categories = await this.categoryService.getCategories({});
            return res.json({ categories });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new BillController(categoryService);
