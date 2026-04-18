const express = require("express");
const mediaController = require("../controllers/media.controller");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/upload-images", requireAuth, mediaController.uploadImages);
router.post("/upload-video", requireAuth, mediaController.uploadVideo);
router.post("/upload-video/init", requireAuth, mediaController.initVideoUpload);
router.post("/upload-video/chunk", requireAuth, mediaController.uploadVideoChunk);
router.post("/upload-video/complete", requireAuth, mediaController.completeVideoUpload);
router.post("/upload-video/cancel", requireAuth, mediaController.cancelVideoUpload);
router.delete("/:assetId", requireAuth, mediaController.removeAsset);

module.exports = { mediaRouter: router };
