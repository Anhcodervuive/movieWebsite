const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class director_movie extends Model {}

director_movie.init(
    {
        movie_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'movies',
                key: 'id',
            },
            allowNull: false,
        },
        director_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'directors',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'director_movie',
    }
);

module.exports = director_movie;
