const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class actor_movie extends Model {}

actor_movie.init(
    {
        movie_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'movies',
                key: 'id',
            },
            allowNull: false,
        },
        actor_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'actors',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'actor_movie',
    }
);

module.exports = actor_movie;
