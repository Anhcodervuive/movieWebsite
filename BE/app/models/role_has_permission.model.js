const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class role_has_permissions extends Model {}

role_has_permissions.init(
    {
        role_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'roles',
                key: 'id',
            },
            allowNull: false,
        },
        permission_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'permissions',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'role_has_permissions',
    }
);

module.exports = role_has_permissions;
