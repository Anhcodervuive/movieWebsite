const express = require('express');
const router = express.Router();

const CategoryController = require('../../controllers/web/category.controller');

router.get('/', CategoryController.getAll);

module.exports = router;
