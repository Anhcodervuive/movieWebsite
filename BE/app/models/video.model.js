const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class video extends Model {}

video.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('ads', 'other'),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'video',
        tableName: 'video',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        deletedAt: 'deleted_at',
        paranoid: true,
    }
);

module.exports = video;
