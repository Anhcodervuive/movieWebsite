const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class movie_required_waching_package extends Model {}

movie_required_waching_package.init(
    {
        movie_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'movies',
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
        tableName: 'movie_required_waching_package',
    }
);

module.exports = movie_required_waching_package;
