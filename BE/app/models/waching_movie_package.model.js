const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');
const { default: slugify } = require('slugify');

const sequelize = MySQL.connect();

class waching_movie_package extends Model {}

waching_movie_package.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresIn: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        disable: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'waching_movie_package',
        tableName: 'waching_movie_package',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        deletedAt: 'deleted_at',
        paranoid: true,
    }
);

module.exports = waching_movie_package;
