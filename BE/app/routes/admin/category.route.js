const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/admin/category.controller');

router
    .route('/')
    .get(categoryController.getCategories)
    .post(categoryController.createCategory);

router.get('/top-view', categoryController.getTopViewCategories);

router
    .route('/:id')
    .get(categoryController.getCategory)
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;
