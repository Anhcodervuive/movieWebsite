const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const VIDEO_UPLOADS_PATH = path.resolve(__dirname, '../../../uploads/ads');

const storageAds = multer.diskStorage({
    destination: VIDEO_UPLOADS_PATH,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storageAds });

const videoController = require('../../controllers/admin/video.controller');

router
    .route('/')
    .get(videoController.getAll)
    .post(upload.single('videoFile'), videoController.create);

router
    .route('/:id')
    .get(videoController.getById)
    .put(videoController.update)
    .delete(videoController.delete);

module.exports = router;
