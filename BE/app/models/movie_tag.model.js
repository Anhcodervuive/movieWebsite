const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class movie_tag extends Model {}

movie_tag.init(
    {
        movie_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'movies',
                key: 'id',
            },
            allowNull: false,
        },
        tag_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'tags',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'movie_tag',
    }
);

module.exports = movie_tag;
