const path = require("path");

const IMAGE_LIMIT = 30;
const VIDEO_LIMIT = 1;
const MAX_IMAGE_SIZE = 12 * 1024 * 1024;
const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"];
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];
const VIDEO_EXT = [".mp4", ".webm", ".mov"];

function safeExt(name) {
  const ext = path.extname(String(name || "")).toLowerCase();
  return ext.replace(/[^a-z0-9.]/g, "");
}

function isAllowedImage(file) {
  const ext = safeExt(file && file.originalname);
  return IMAGE_MIME.indexOf(String(file && file.mimetype || "").toLowerCase()) !== -1 && IMAGE_EXT.indexOf(ext) !== -1;
}

function isAllowedVideo(file) {
  const ext = safeExt(file && file.originalname);
  return VIDEO_MIME.indexOf(String(file && file.mimetype || "").toLowerCase()) !== -1 && VIDEO_EXT.indexOf(ext) !== -1;
}

module.exports = {
  IMAGE_LIMIT,
  VIDEO_LIMIT,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  IMAGE_MIME,
  VIDEO_MIME,
  IMAGE_EXT,
  VIDEO_EXT,
  safeExt,
  isAllowedImage,
  isAllowedVideo
};
