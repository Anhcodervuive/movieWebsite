const { PermissionModel } = require('../models');

class PermissionSerivce {
    constructor(permissionModel) {
        this.permission = permissionModel;
    }

    async getAll(options = {}) {
        return await this.permission.findAll(options);
    }
}

module.exports = new PermissionSerivce(PermissionModel);
