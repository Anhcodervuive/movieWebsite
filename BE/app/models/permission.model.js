const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class Permissions extends Model {}

Permissions.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        guard_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'backpack',
        },
    },
    {
        sequelize,
        modelName: 'permissions',
        tableName: 'permissions',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
    }
);

module.exports = Permissions;
