const express = require('express');
const router = express.Router();

const RegionController = require('../../controllers/web/region.controller');

router.get('/', RegionController.getAll);

module.exports = router;
