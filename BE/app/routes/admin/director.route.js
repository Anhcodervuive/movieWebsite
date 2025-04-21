const express = require('express');
const router = express.Router();

const directorController = require('../../controllers/admin/director.controller');

router
    .route('/')
    .get(directorController.getAll)
    .post(directorController.create);

router
    .route('/:id')
    .get(directorController.getById)
    .put(directorController.update)
    .delete(directorController.delete);

module.exports = router;
