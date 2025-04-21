const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class movie_region extends Model {}

movie_region.init(
    {
        movie_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'movies',
                key: 'id',
            },
            allowNull: false,
        },
        region_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'regions',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'movie_region',
    }
);

module.exports = movie_region;
