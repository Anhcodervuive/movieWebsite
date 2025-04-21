const express = require('express');
const router = express.Router();

const { checkLoginMiddleware } = require('../../middlewares/Auth.middleware');
const AuthController = require('../../controllers/Auth.controller');

router.post('/dang-ky', AuthController.register);
router.post('/dang-nhap', AuthController.login);
router.get('/verify-email', AuthController.verifyEmail);
router.post('/dang-xuat', checkLoginMiddleware, AuthController.logout);
router.post('/refresh-token', AuthController.setAccessToken);
router.post(
    '/cap-nhat-thong-tin',
    checkLoginMiddleware,
    AuthController.updateInfor
);
router.post(
    '/doi-mat-khau',
    checkLoginMiddleware,
    AuthController.changePassword
);

module.exports = router;
