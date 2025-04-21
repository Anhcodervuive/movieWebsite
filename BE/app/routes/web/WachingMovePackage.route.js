const express = require('express');
const router = express.Router();

const wachingMoviePackageController = require('../../controllers/web/WachingMoviePackage.controller');

const { checkLoginMiddleware } = require('../../middlewares/Auth.middleware');

router.route('/').get(wachingMoviePackageController.getAll);
router.post(
    '/create-vnpay-payment',
    checkLoginMiddleware,
    wachingMoviePackageController.createVnpayPayment
);

router.get(
    '/return-url-vnpay-payment/:userId/:packageId/',
    wachingMoviePackageController.handleReturnPayment
);

module.exports = router;
