const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class user_has_waching_package extends Model {}

user_has_waching_package.init(
    {
        waching_movie_package_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'waching_movie_package',
                key: 'id',
            },
            allowNull: false,
        },
        expired_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        user_id: {
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
        tableName: 'user_has_waching_package',
    }
);

module.exports = user_has_waching_package;
