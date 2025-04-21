const roleService = require('../../services/role.service');
const ApiError = require('../../api-error');

class PermissionController {
    constructor(roleService) {
        this.roleService = roleService;
    }

    getAll = async (req, res, next) => {
        try {
            const roles = await this.roleService.getAll();
            return res.json({ roles });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const role = await this.roleService.getById(id);
            return res.json({ role });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    create = async (req, res, next) => {
        try {
            await this.roleService.create(req.body);
            return res.json({
                type: 'success',
                message: 'Tạo role thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.roleService.update(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật role thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.roleService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa role thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new PermissionController(roleService);
