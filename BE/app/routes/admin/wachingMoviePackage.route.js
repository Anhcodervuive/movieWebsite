const express = require('express');
const router = express.Router();

const wachingMoviePackageController = require('../../controllers/admin/wachingMoviePackage.controller');

router
    .route('/')
    .get(wachingMoviePackageController.getAll)
    .post(wachingMoviePackageController.create);

router.put('/enable/:id', wachingMoviePackageController.enable);
router.put('/disable/:id', wachingMoviePackageController.disable);

router
    .route('/:id')
    .get(wachingMoviePackageController.getById)
    .put(wachingMoviePackageController.update)
    .delete(wachingMoviePackageController.delete);

module.exports = router;
