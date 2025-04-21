const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class Rating extends Model {}

Rating.init(
    {
        star: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        movie_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        tableName: 'rating',
        sequelize,
        timestamps: false,
    }
);

module.exports = Rating;
