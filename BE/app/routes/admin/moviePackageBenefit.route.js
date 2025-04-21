const express = require('express');
const router = express.Router();

const moviePackageBenefitController = require('../../controllers/admin/moviePackageBenefit.controller');

router
    .route('/')
    .get(moviePackageBenefitController.getAll)
    .post(moviePackageBenefitController.create);

router
    .route('/:id')
    .get(moviePackageBenefitController.getById)
    .put(moviePackageBenefitController.update)
    .delete(moviePackageBenefitController.delete);

module.exports = router;
