const express = require('express');
const router = express.Router();

const {
    checkLoginMiddleware,
    autoRefreshTokenMiddleware,
    isHaveRoles,
} = require('../../middlewares/Auth.middleware');

const CatalogController = require('../../controllers/web/catalog.controller');

router
    .route('/')
    .get(CatalogController.getAllCatalog)
    .post(
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        CatalogController.createCatalog
    );

router
    .route('/:id')
    .get(autoRefreshTokenMiddleware, CatalogController.getCatalog)
    .put(
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        CatalogController.updateCatalog
    )
    .delete(
        checkLoginMiddleware,
        isHaveRoles(['Admin']),
        CatalogController.deleteCatalog
    );

module.exports = router;
