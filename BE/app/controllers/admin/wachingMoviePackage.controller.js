const wachingMoviePackageSerivce = require('../../services/WacthingMoviePackage.service');
const ApiError = require('../../api-error');

class WachingMoviePackageController {
    constructor(wachingMoviePackageSerivce) {
        this.wachingMoviePackageSerivce = wachingMoviePackageSerivce;
    }

    getAll = async (req, res, next) => {
        try {
            const wachingMoviePackages =
                await this.wachingMoviePackageSerivce.getAll({
                    limit: 50,
                    order: [['created_at', 'DESC']],
                });
            return res.json({ wachingMoviePackages });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const wachingMoviePackage =
                await this.wachingMoviePackageSerivce.getById(id);
            return res.json({ wachingMoviePackage });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    create = async (req, res, next) => {
        try {
            await this.wachingMoviePackageSerivce.create(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;

            await this.wachingMoviePackageSerivce.update(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.wachingMoviePackageSerivce.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    enable = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.wachingMoviePackageSerivce.enable(id);
            return res.json({
                type: 'success',
                message: 'Kích hoạt gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    disable = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.wachingMoviePackageSerivce.disable(id);
            return res.json({
                type: 'success',
                message: 'Khóa gói phim thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new WachingMoviePackageController(wachingMoviePackageSerivce);
