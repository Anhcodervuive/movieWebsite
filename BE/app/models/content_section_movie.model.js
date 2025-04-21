const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class content_section_movie extends Model {}

content_section_movie.init(
    {
        content_section_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'content_sections',
                key: 'id',
            },
            allowNull: false,
        },
        movie_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'movies',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'content_section_movie',
    }
);

module.exports = content_section_movie;
