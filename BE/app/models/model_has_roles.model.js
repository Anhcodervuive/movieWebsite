const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class Model_has_roles extends Model {}

Model_has_roles.init(
    {
        role_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'roles',
                key: 'id',
            },
            allowNull: false,
        },
        model_type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'App\\Models\\User',
        },
        model_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'users',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'model_has_roles',
    }
);

module.exports = Model_has_roles;
