const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class episode_required_waching_package extends Model {}

episode_required_waching_package.init(
    {
        episode_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'episodes',
                key: 'id',
            },
            allowNull: false,
        },
        waching_movie_package_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'waching_movie_package',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'episode_required_waching_package',
    }
);

module.exports = episode_required_waching_package;
