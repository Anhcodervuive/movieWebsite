const express = require('express');
const router = express.Router();

const billController = require('../../controllers/web/bill.controller');

const { checkLoginMiddleware } = require('../../middlewares/Auth.middleware');

router.get('/:userId', checkLoginMiddleware, billController.getByUserId);

module.exports = router;
