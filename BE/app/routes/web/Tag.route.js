const express = require('express');
const router = express.Router();

const tagController = require('../../controllers/web/tag.controller');

router.get('/recommended-tags', tagController.getRecommendedTag);
router.get('/find', tagController.findTags);

module.exports = router;
