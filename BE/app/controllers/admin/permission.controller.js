const permissionService = require('../../services/permission.service');
const ApiError = require('../../api-error');

class DirectorController {
    constructor(permissionService) {
        this.permissionService = permissionService;
    }

    getAll = async (req, res, next) => {
        try {
            const permissions = await this.permissionService.getAll();
            return res.json({ permissions });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new DirectorController(permissionService);
