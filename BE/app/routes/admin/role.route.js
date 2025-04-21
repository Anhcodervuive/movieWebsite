const express = require('express');
const router = express.Router();

const roleController = require('../../controllers/admin/role.controller');

router.route('/').get(roleController.getAll).post(roleController.create);

router
    .route('/:id')
    .get(roleController.getById)
    .put(roleController.update)
    .delete(roleController.delete);

module.exports = router;
