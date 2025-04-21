const { Model, DataTypes } = require('sequelize');
const slugify = require('slugify');
const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class Movie extends Model {}

Movie.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        origin_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        thumb_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        poster_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        trailer_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        episode_time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        episode_current: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        episode_total: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        quality: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_shown_in_theater: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        is_recommended: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        showtimes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        notify: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_sensitive_content: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        publish_year: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        rating_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        rating_star: {
            type: DataTypes.DECIMAL,
            defaultValue: 0.0,
        },
        view_total: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        view_day: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        view_week: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        view_month: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'movies',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
        hooks: {
            beforeValidate: async (model, options) => {
                if (model.name && !model.slug) {
                    let slug = slugify(model.name, {
                        lower: true,
                        strict: true,
                    });
                    // Kiểm tra nếu slug đã tồn tại
                    let slugExists = await Movie.findOne({
                        where: { slug },
                    });
                    let counter = 1;
                    while (slugExists) {
                        slug = `${slug}-${counter++}`;
                        slugExists = await Movie.findOne({
                            where: { slug },
                        });
                    }
                    model.slug = slug;
                }
            },
        },
    }
);
module.exports = Movie;
