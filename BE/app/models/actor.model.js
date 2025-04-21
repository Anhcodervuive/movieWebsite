const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');
const { default: slugify } = require('slugify');

const sequelize = MySQL.connect();

class actors extends Model {}

actors.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name_md5: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        thumb_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'actors',
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
                    let slugExists = await actors.findOne({
                        where: { slug },
                    });
                    let counter = 1;
                    while (slugExists) {
                        slug = `${slug}-${counter++}`;
                        slugExists = await actors.findOne({
                            where: { slug },
                        });
                    }
                    model.slug = slug;
                }
            },
        },
    }
);

module.exports = actors;
