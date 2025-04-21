const express = require('express');
const router = express.Router();

const CatalogController = require('../../controllers/web/catalog.controller');

router.get('/', CatalogController.getAllCatalog);

module.exports = router;
