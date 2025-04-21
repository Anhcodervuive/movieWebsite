const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

const MovieModel = require('./movie.model');

class episodes extends Model {}

episodes.init(
    {
        movie_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: MovieModel,
                key: 'id',
            },
        },
        server: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'episodes',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
    }
);

module.exports = episodes;
