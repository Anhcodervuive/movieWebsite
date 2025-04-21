const { RoleModel, Model_has_roles, PermissionModel } = require('../models');

class RoleSerivce {
    constructor(roleModel) {
        this.role = roleModel;
    }

    extractData(payload) {
        const { name, guard_name } = payload;
        const data = {
            name,
            guard_name,
        };

        Object.keys(data).forEach((key) => {
            if (data[key] === undefined) {
                delete data[key];
            }
        });
        return data;
    }

    async getRoleByUser(user) {
        return await user.getRoles();
    }

    async getRoleByUserId(userId) {
        return await this.role.findAll({
            include: [
                {
                    model: Model_has_roles,
                    where: {
                        model_id: userId,
                    },
                    required: true,
                },
            ],
        });
    }

    async getAll(options = {}) {
        return await this.role.findAll(options);
    }

    async getById(id) {
        return await this.role.findByPk(id, {
            include: [
                {
                    model: PermissionModel,
                    attributes: ['id', 'name'],
                },
            ],
        });
    }

    async create(payload) {
        const data = this.extractData(payload);
        const permission = payload.permissionIds || [];
        const roleModel = await this.role.create(data);

        await roleModel.addPermissions(permission);

        return roleModel;
    }

    async update(id, payload) {
        const data = this.extractData(payload);
        const permission = payload.permissionIds || [];
        const roleModel = await this.getById(id);
        await roleModel.setPermissions(permission);
        return await this.role.update(data, {
            where: {
                id,
            },
        });
    }

    async delete(id) {
        return await this.role.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new RoleSerivce(RoleModel);
