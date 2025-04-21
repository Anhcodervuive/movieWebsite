const userService = require('../../services/user.service');
const ApiError = require('../../api-error');
const { WachingMoviePackage, RoleModel } = require('../../models');

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getAll = async (req, res, next) => {
        try {
            const users = await this.userService.getUsers({
                attributes: ['id', 'name', 'email', 'created_at'],
                include: [
                    {
                        model: WachingMoviePackage,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: RoleModel,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });
            return res.json({ users });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getById(id);
            if (!user) return next(new ApiError(404, 'User not found'));
            return res.json({ user });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    create = async (req, res, next) => {
        try {
            await this.userService.create(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo user thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.userService.update(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.userService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getQuantityVipAndNonVipUser = async (req, res, next) => {
        try {
            const users = await this.userService.getUsers({
                include: [
                    {
                        model: WachingMoviePackage,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });

            let normalUser = 0;
            let vipUser = 0;

            users.forEach((user) => {
                if (user?.waching_movie_packages?.length > 0) vipUser++;
                else normalUser++;
            });
            return res.json({ normalUser, vipUser });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new UserController(userService);
