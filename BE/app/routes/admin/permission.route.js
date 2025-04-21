const express = require('express');
const router = express.Router();

const permissionController = require('../../controllers/admin/permission.controller');

router.route('/').get(permissionController.getAll);

module.exports = router;
