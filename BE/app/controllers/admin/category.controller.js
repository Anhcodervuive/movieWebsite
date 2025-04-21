const categoryService = require('../../services/category.service');
const ApiError = require('../../api-error');
const { where, Op, Sequelize } = require('sequelize');
const { MovieModel } = require('../../models');

class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    getCategories = async (req, res, next) => {
        try {
            const { name = '' } = req.query;
            const categories = await this.categoryService.getCategories({
                where: {
                    name: {
                        [Op.like]: `%${name}%`,
                    },
                },
                order: [['created_at', 'DESC']],
            });
            return res.json({ categories });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(id);
            return res.json({ category });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    createCategory = async (req, res, next) => {
        try {
            const { slug } = req.body;

            const category = await this.categoryService.findBySlug(slug);

            if (category) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.categoryService.createCategory(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo danh mục thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    updateCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { slug } = req.body;

            const category = await this.categoryService.findBySlug(slug);
            console.log(category, id);

            if (category && category?.id != id) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.categoryService.updateCategory(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật diễn viên thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    deleteCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.categoryService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa danh mục thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getTopViewCategories = async (req, res, next) => {
        try {
            const { type = 'view_total' } = req.query;
            let categories = await this.categoryService.getCategories({
                attributes: ['id', 'name'],
                include: [
                    {
                        model: MovieModel,
                        attributes: [type],
                        through: {
                            attributes: [], // Loại bỏ các trường không cần thiết từ bảng trung gian
                        },
                    },
                ],
                limit: 5,
            });

            categories = categories.map((category) => {
                const totalView = category.movies.reduce((acc, current) => {
                    return acc + current[type];
                }, 0);
                delete category.movies;
                return {
                    id: category.id,
                    name: category.name,
                    totalView,
                };
            });

            categories.sort((a, b) => b.totalView - a.totalView);

            return res.json({ categories });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new CategoryController(categoryService);
