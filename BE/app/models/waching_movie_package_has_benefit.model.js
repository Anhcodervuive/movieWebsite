const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class waching_movie_package_has_benefit extends Model {}

waching_movie_package_has_benefit.init(
    {
        waching_movie_package_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'waching_movie_package',
                key: 'id',
            },
        },
        movie_package_benefit_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'movie_package_benefit',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'waching_movie_package_has_benefit',
        timestamps: false,
    }
);

module.exports = waching_movie_package_has_benefit;
