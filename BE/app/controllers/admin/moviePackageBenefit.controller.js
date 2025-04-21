const moviePackageBenefitService = require('../../services/moviePackageBenefit.service');
const ApiError = require('../../api-error');

class MoviePackageBenefitController {
    constructor(moviePackageBenefitService) {
        this.moviePackageBenefitService = moviePackageBenefitService;
    }

    getAll = async (req, res, next) => {
        try {
            const moviePackageBenefits =
                await this.moviePackageBenefitService.getAll({
                    limit: 50,
                    order: [['created_at', 'DESC']],
                });
            return res.json({ moviePackageBenefits });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const moviePackageBenefit =
                await this.moviePackageBenefitService.getById(id);
            return res.json({ moviePackageBenefit });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    create = async (req, res, next) => {
        try {
            await this.moviePackageBenefitService.create(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo lợi ích gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;

            await this.moviePackageBenefitService.update(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật lợi ích gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.moviePackageBenefitService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa lợi ích gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new MoviePackageBenefitController(moviePackageBenefitService);
