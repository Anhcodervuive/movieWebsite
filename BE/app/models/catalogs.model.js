const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');
const slugify = require('slugify');

const sequelize = MySQL.connect();

class catalogs extends Model {}

catalogs.init(
    {
        name: {
            type: DataTypes.STRING,

            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        paginate: {
            type: DataTypes.INTEGER,

            defaultValue: 20,
        },
    },
    {
        sequelize,
        timestamps: true,
        tableName: 'catalogs',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        hooks: {
            beforeValidate: async (model, options) => {
                if (model.name && !model.slug) {
                    let slug = slugify(model.name, {
                        lower: true,
                        strict: true,
                    });
                    // Kiểm tra nếu slug đã tồn tại
                    let slugExists = await catalogs.findOne({
                        where: { slug },
                    });
                    let counter = 1;
                    while (slugExists) {
                        slug = `${slug}-${counter++}`;
                        slugExists = await catalogs.findOne({
                            where: { slug },
                        });
                    }
                    model.slug = slug;
                }
            },
        },
    }
);

module.exports = catalogs;
