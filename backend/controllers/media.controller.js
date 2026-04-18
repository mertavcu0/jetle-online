const fs = require("fs/promises");
const multer = require("multer");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const mediaService = require("../services/media.service");
const { IMAGE_LIMIT, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE, isAllowedImage, isAllowedVideo } = require("../utils/mediaPolicy");

const imageUpload = multer({
  dest: mediaService.TMP_DIR,
  limits: { fileSize: MAX_IMAGE_SIZE, files: IMAGE_LIMIT },
  fileFilter: function (req, file, cb) {
    if (!isAllowedImage(file)) return cb(new ApiError(400, "Desteklenmeyen görsel formatı. JPG, PNG veya WebP yükleyin."));
    cb(null, true);
  }
});

const videoUpload = multer({
  dest: mediaService.TMP_DIR,
  limits: { fileSize: MAX_VIDEO_SIZE, files: 1 },
  fileFilter: function (req, file, cb) {
    if (!isAllowedVideo(file)) return cb(new ApiError(400, "Video formatı desteklenmiyor. MP4, MOV veya WebM yükleyin."));
    cb(null, true);
  }
});
const chunkUpload = multer({
  dest: mediaService.TMP_DIR,
  limits: { fileSize: 6 * 1024 * 1024, files: 1 }
});

const uploadImages = [
  imageUpload.array("images", IMAGE_LIMIT),
  asyncHandler(async function uploadImages(req, res) {
    const files = Array.isArray(req.files) ? req.files : [];
    if (!files.length) throw new ApiError(400, "En az bir fotoğraf seçin.");
    const out = [];
    for (let i = 0; i < files.length; i += 1) {
      const f = files[i];
      if (!isAllowedImage(f)) {
        await fs.unlink(f.path).catch(function () {});
        throw new ApiError(400, "Desteklenmeyen görsel formatı. JPG, PNG veya WebP yükleyin.");
      }
      const img = await mediaService.processImageFile(req.auth.userId, f.path, req, f.originalname);
      out.push(img);
      await fs.unlink(f.path).catch(function () {});
    }
    res.status(201).json({ ok: true, data: { images: out } });
  })
];

const uploadVideo = [
  videoUpload.single("video"),
  asyncHandler(async function uploadVideo(req, res) {
    const f = req.file;
    if (!f) throw new ApiError(400, "Video dosyası bulunamadı.");
    if (!isAllowedVideo(f)) {
      await fs.unlink(f.path).catch(function () {});
      throw new ApiError(400, "Video formatı desteklenmiyor. MP4, MOV veya WebM yükleyin.");
    }
    const video = await mediaService.processVideoFile(req.auth.userId, f, req);
    res.status(201).json({ ok: true, data: { video: video } });
  })
];

const removeAsset = asyncHandler(async function removeAsset(req, res) {
  const ok = await mediaService.deleteAsset(req.auth.userId, req.params.assetId);
  if (!ok) throw new ApiError(404, "Medya kaydı bulunamadı.");
  res.json({ ok: true });
});

const initVideoUpload = asyncHandler(async function initVideoUpload(req, res) {
  const body = req.body || {};
  if (!isAllowedVideo({ mimetype: body.mimeType, originalname: body.fileName })) {
    throw new ApiError(400, "Video formatı desteklenmiyor. MP4, MOV veya WebM yükleyin.");
  }
  if (Number(body.totalSize || 0) > MAX_VIDEO_SIZE) {
    throw new ApiError(400, "Video dosyası çok büyük. En fazla 200 MB yükleyebilirsiniz.");
  }
  const sessionId = mediaService.initVideoChunkSession(
    req.auth.userId,
    body.fileName || "video",
    body.mimeType || "video/mp4",
    Number(body.totalSize || 0)
  );
  res.status(201).json({ ok: true, data: { sessionId: sessionId } });
});

const uploadVideoChunk = [
  chunkUpload.single("chunk"),
  asyncHandler(async function uploadVideoChunk(req, res) {
    const f = req.file;
    if (!f) throw new ApiError(400, "Video parçası bulunamadı.");
    const body = req.body || {};
    const state = await mediaService.appendVideoChunk(req.auth.userId, body.sessionId, f.path, Number(body.offset || 0), f.size);
    res.json({ ok: true, data: state });
  })
];

const completeVideoUpload = asyncHandler(async function completeVideoUpload(req, res) {
  const body = req.body || {};
  const video = await mediaService.completeVideoChunkSession(req.auth.userId, body.sessionId, req);
  res.status(201).json({ ok: true, data: { video: video } });
});

const cancelVideoUpload = asyncHandler(async function cancelVideoUpload(req, res) {
  const body = req.body || {};
  await mediaService.cancelVideoChunkSession(req.auth.userId, body.sessionId);
  res.json({ ok: true });
});

module.exports = {
  uploadImages,
  uploadVideo,
  removeAsset,
  initVideoUpload,
  uploadVideoChunk,
  completeVideoUpload,
  cancelVideoUpload
};
