const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');
const { default: slugify } = require('slugify');

const sequelize = MySQL.connect();

class movie_package_benefit extends Model {}

movie_package_benefit.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'movie_package_benefit',
        tableName: 'movie_package_benefit',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        deletedAt: 'deleted_at',
        paranoid: true,
    }
);

module.exports = movie_package_benefit;
