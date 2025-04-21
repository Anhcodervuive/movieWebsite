const express = require('express');
const router = express.Router();

const actorController = require('../../controllers/admin/actor.controller');

router
    .route('/')
    .get(actorController.getActors)
    .post(actorController.createActor);

router
    .route('/:id')
    .get(actorController.getActor)
    .put(actorController.updateMovie)
    .delete(actorController.deleteActor);

module.exports = router;
