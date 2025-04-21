const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class content_sections extends Model {}

content_sections.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('banner', 'normal'),
            allowNull: false,
        },
        catalog_id: {
            type: DataTypes.STRING,
            references: {
                model: 'catalogs',
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'content_sections',
    }
);

module.exports = content_sections;
