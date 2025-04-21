const express = require('express');
const router = express.Router();

const userController = require('../../controllers/admin/user.controller');

router
    .route('/get-quantity-vip-non-vip-user')
    .get(userController.getQuantityVipAndNonVipUser);

router.route('/').get(userController.getAll).post(userController.create);
router
    .route('/:id')
    .get(userController.getById)
    .put(userController.update)
    .delete(userController.delete);

module.exports = router;
