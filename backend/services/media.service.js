const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { ApiError } = require("../utils/ApiError");
const { MediaAsset } = require("../models/MediaAsset");
const { env } = require("../config/env");
const { isAllowedImage, isAllowedVideo, safeExt } = require("../utils/mediaPolicy");

const UPLOAD_ROOT = path.resolve(__dirname, "../uploads");
const ORIGINAL_DIR = path.join(UPLOAD_ROOT, "original");
const MEDIUM_DIR = path.join(UPLOAD_ROOT, "medium");
const THUMB_DIR = path.join(UPLOAD_ROOT, "thumb");
const VIDEO_DIR = path.join(UPLOAD_ROOT, "video");
const TMP_DIR = path.join(UPLOAD_ROOT, "_tmp");
const videoChunkSessions = new Map();

function ensureUploadDirs() {
  [UPLOAD_ROOT, ORIGINAL_DIR, MEDIUM_DIR, THUMB_DIR, VIDEO_DIR, TMP_DIR].forEach(function (dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function makeName(ext) {
  return Date.now() + "-" + crypto.randomBytes(8).toString("hex") + ext;
}

function toPublicUrl(req, relPath) {
  const normalized = "/" + String(relPath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  if (env.MEDIA_BASE_URL) return env.MEDIA_BASE_URL.replace(/\/+$/, "") + normalized;
  const host = req.get("host");
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  return proto + "://" + host + normalized;
}

function relFromAbs(abs) {
  return "/" + path.relative(path.resolve(__dirname, ".."), abs).replace(/\\/g, "/");
}

function mimeFromExt(ext) {
  const e = String(ext || "").toLowerCase();
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  return "image/jpeg";
}

async function processImageFile(ownerId, filePath, req, originalName) {
  const ext = safeExt(originalName) || ".jpg";
  const base = makeName(ext);
  const originalOut = path.join(ORIGINAL_DIR, base);
  const mediumOut = path.join(MEDIUM_DIR, base);
  const thumbOut = path.join(THUMB_DIR, base);

  await fsp.copyFile(filePath, originalOut);
  await fsp.copyFile(filePath, mediumOut);
  await fsp.copyFile(filePath, thumbOut);

  const asset = await MediaAsset.create({
    ownerId: ownerId,
    kind: "image",
    originalUrl: toPublicUrl(req, relFromAbs(originalOut)),
    mediumUrl: toPublicUrl(req, relFromAbs(mediumOut)),
    thumbUrl: toPublicUrl(req, relFromAbs(thumbOut)),
    mimeType: mimeFromExt(ext),
    attached: false
  });
  return {
    id: String(asset._id),
    originalUrl: asset.originalUrl,
    mediumUrl: asset.mediumUrl,
    thumbUrl: asset.thumbUrl,
    isCover: false,
    order: 0
  };
}

async function processVideoFile(ownerId, file, req) {
  if (!isAllowedVideo(file)) {
    throw new ApiError(400, "Video formatı desteklenmiyor. MP4, MOV veya WebM yükleyin.");
  }
  const ext = safeExt(file.originalname);
  const fileName = makeName(ext || ".mp4");
  const target = path.join(VIDEO_DIR, fileName);
  await fsp.rename(file.path, target);
  const stat = await fsp.stat(target);
  const asset = await MediaAsset.create({
    ownerId: ownerId,
    kind: "video",
    url: toPublicUrl(req, relFromAbs(target)),
    mimeType: file.mimetype || "video/mp4",
    size: stat.size,
    attached: false
  });
  return {
    id: String(asset._id),
    url: asset.url,
    type: asset.mimeType,
    size: asset.size
  };
}

async function deleteAsset(ownerId, assetId) {
  const asset = await MediaAsset.findById(assetId);
  if (!asset) return false;
  if (String(asset.ownerId) !== String(ownerId)) throw new ApiError(403, "Bu medya size ait değil.");
  if (asset.attached) throw new ApiError(400, "Yayında kullanılan medya silinemez.");
  await MediaAsset.deleteOne({ _id: asset._id });
  return true;
}

async function resolveImageRefs(ownerId, images) {
  const out = [];
  const list = Array.isArray(images) ? images : [];
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i] || {};
    const assetId = item.assetId || item.id;
    if (!assetId) {
      const originalUrl = String(item.originalUrl || item.url || "").trim();
      if (!originalUrl) continue;
      out.push({
        assetId: "",
        originalUrl: originalUrl,
        mediumUrl: String(item.mediumUrl || originalUrl).trim(),
        thumbUrl: String(item.thumbUrl || item.mediumUrl || originalUrl).trim(),
        isCover: !!item.isCover,
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : i
      });
      continue;
    }
    const asset = await MediaAsset.findById(assetId);
    if (!asset || String(asset.ownerId) !== String(ownerId) || asset.kind !== "image") {
      throw new ApiError(400, "Seçilen fotoğraflardan biri geçersiz veya size ait değil.");
    }
    out.push({
      assetId: String(asset._id),
      originalUrl: asset.originalUrl,
      mediumUrl: asset.mediumUrl || asset.originalUrl,
      thumbUrl: asset.thumbUrl || asset.mediumUrl || asset.originalUrl,
      isCover: !!item.isCover,
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : i
    });
    if (!asset.attached) {
      asset.attached = true;
      await asset.save();
    }
  }
  return out;
}

async function resolveVideoRef(ownerId, video) {
  if (!video) return null;
  if (!video.assetId) {
    return {
      assetId: "",
      url: String(video.url || "").trim(),
      type: String(video.type || "video/mp4").trim(),
      size: Number(video.size || 0)
    };
  }
  const asset = await MediaAsset.findById(video.assetId);
  if (!asset || String(asset.ownerId) !== String(ownerId) || asset.kind !== "video") {
    throw new ApiError(400, "Video referansı geçersiz veya size ait değil.");
  }
  if (!asset.attached) {
    asset.attached = true;
    await asset.save();
  }
  return {
    assetId: String(asset._id),
    url: asset.url,
    type: asset.mimeType || "video/mp4",
    size: Number(asset.size || 0)
  };
}

function initVideoChunkSession(ownerId, fileName, mimeType, totalSize) {
  const sessionId = crypto.randomBytes(16).toString("hex");
  const tmpPath = path.join(TMP_DIR, sessionId + ".part");
  videoChunkSessions.set(sessionId, {
    sessionId: sessionId,
    ownerId: String(ownerId),
    fileName: String(fileName || "video"),
    mimeType: String(mimeType || "video/mp4"),
    totalSize: Number(totalSize || 0),
    uploadedSize: 0,
    tmpPath: tmpPath,
    createdAt: Date.now()
  });
  return sessionId;
}

function getVideoChunkSession(ownerId, sessionId) {
  const s = videoChunkSessions.get(String(sessionId || ""));
  if (!s) throw new ApiError(404, "Video yükleme oturumu bulunamadı.");
  if (String(s.ownerId) !== String(ownerId)) throw new ApiError(403, "Bu oturum size ait değil.");
  return s;
}

async function appendVideoChunk(ownerId, sessionId, chunkPath, offset, size) {
  const s = getVideoChunkSession(ownerId, sessionId);
  const nOffset = Number(offset || 0);
  if (nOffset !== s.uploadedSize) throw new ApiError(409, "Parça sırası bozuk. Yükleme kaldığı yerden devam etmeli.");
  const buf = await fsp.readFile(chunkPath);
  await fsp.appendFile(s.tmpPath, buf);
  s.uploadedSize += Number(size || buf.length);
  await fsp.unlink(chunkPath).catch(function () {});
  return { uploadedSize: s.uploadedSize, totalSize: s.totalSize };
}

async function completeVideoChunkSession(ownerId, sessionId, req) {
  const s = getVideoChunkSession(ownerId, sessionId);
  const ext = safeExt(s.fileName) || ".mp4";
  const fileName = makeName(ext);
  const target = path.join(VIDEO_DIR, fileName);
  await fsp.rename(s.tmpPath, target);
  const stat = await fsp.stat(target);
  const asset = await MediaAsset.create({
    ownerId: ownerId,
    kind: "video",
    url: toPublicUrl(req, relFromAbs(target)),
    mimeType: s.mimeType || "video/mp4",
    size: stat.size,
    attached: false,
    meta: { uploadMode: "chunked" }
  });
  videoChunkSessions.delete(String(sessionId));
  return {
    id: String(asset._id),
    url: asset.url,
    type: asset.mimeType,
    size: asset.size
  };
}

async function cancelVideoChunkSession(ownerId, sessionId) {
  const s = getVideoChunkSession(ownerId, sessionId);
  videoChunkSessions.delete(String(sessionId));
  await fsp.unlink(s.tmpPath).catch(function () {});
  return true;
}

module.exports = {
  ensureUploadDirs,
  TMP_DIR,
  processImageFile,
  processVideoFile,
  deleteAsset,
  resolveImageRefs,
  resolveVideoRef,
  initVideoChunkSession,
  appendVideoChunk,
  completeVideoChunkSession,
  cancelVideoChunkSession
};
