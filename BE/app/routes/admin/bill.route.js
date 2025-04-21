const express = require('express');
const router = express.Router();

const billController = require('../../controllers/admin/bill.controller');

router.get('/', billController.getAll);

router.delete('/:id', billController.delete);

module.exports = router;
