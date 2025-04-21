const { where } = require('sequelize');
const { CategoriesModel } = require('../models');

class CategoryService {
    constructor(categoryModel) {
        this.category = categoryModel;
    }

    extractData(payload) {
        const data = {
            name: payload.name,
            slug: payload.slug,
        };

        return data;
    }

    async getCategories(condition = {}) {
        return await this.category.findAll(condition);
    }

    async findBySlug(slug) {
        return await this.category.findOne({
            where: {
                slug,
            },
        });
    }

    async getCategoryById(id) {
        return await this.category.findOne({
            where: {
                id,
            },
        });
    }

    async createCategory(payload) {
        const category = this.extractData(payload);
        return await this.category.create(category);
    }

    async updateCategory(id, payload) {
        const category = this.extractData(payload);
        return await this.category.update(category, {
            where: {
                id,
            },
        });
    }

    async delete(id) {
        return await this.category.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new CategoryService(CategoriesModel);
