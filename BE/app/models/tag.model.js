const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');
const { default: slugify } = require('slugify');

const sequelize = MySQL.connect();

class tags extends Model {}

tags.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name_md5: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        search_count: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'tags',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
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
                    let slugExists = await tags.findOne({
                        where: { slug },
                    });
                    let counter = 1;
                    while (slugExists) {
                        slug = `${slug}-${counter++}`;
                        slugExists = await tags.findOne({
                            where: { slug },
                        });
                    }
                    model.slug = slug;
                }
            },
        },
    }
);

module.exports = tags;
