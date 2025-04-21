const express = require('express');
const router = express.Router();

const regionController = require('../../controllers/admin/region.controller');

router
    .route('/')
    .get(regionController.getRegions)
    .post(regionController.createRegion);

router
    .route('/:id')
    .get(regionController.getRegion)
    .put(regionController.updateRegion)
    .delete(regionController.deleteRegion);

module.exports = router;
