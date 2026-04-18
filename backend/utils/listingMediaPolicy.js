const { ApiError } = require("./ApiError");
const { IMAGE_LIMIT } = require("./mediaPolicy");

const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"];

function normalizeImageItem(item, index) {
  if (!item) return null;
  if (typeof item === "string") {
    return {
      assetId: "",
      originalUrl: item,
      mediumUrl: item,
      thumbUrl: item,
      isCover: index === 0,
      order: index
    };
  }
  const originalUrl = String(item.originalUrl || item.url || "").trim();
  if (!originalUrl) return null;
  return {
    assetId: String(item.assetId || item.id || "").trim(),
    originalUrl: originalUrl,
    mediumUrl: String(item.mediumUrl || originalUrl).trim(),
    thumbUrl: String(item.thumbUrl || item.mediumUrl || originalUrl).trim(),
    isCover: !!item.isCover,
    order: Number.isFinite(Number(item.order)) ? Number(item.order) : index
  };
}

function normalizeVideo(raw) {
  if (!raw) return null;
  if (typeof raw === "string") return { assetId: "", url: raw, type: "video/mp4", size: 0 };
  const url = String(raw.url || "").trim();
  if (!url) return null;
  const type = String(raw.type || "").trim().toLowerCase();
  return {
    assetId: String(raw.assetId || "").trim(),
    url: url,
    type: VIDEO_MIME.indexOf(type) !== -1 ? type : "video/mp4",
    size: Number(raw.size || 0)
  };
}

function assertListingMedia(media) {
  const m = media && typeof media === "object" ? media : {};
  const rawImages = Array.isArray(m.images) ? m.images : [];
  if (rawImages.length > IMAGE_LIMIT) throw new ApiError(400, "En fazla 30 fotoğraf yükleyebilirsiniz.");
  const images = rawImages.map(normalizeImageItem).filter(Boolean).sort(function (a, b) { return a.order - b.order; });
  images.forEach(function (it, i) { it.order = i; });
  let coverIndex = images.findIndex(function (it) { return it.isCover; });
  if (coverIndex < 0 && images.length) coverIndex = 0;
  const coverImage = images[coverIndex] ? images[coverIndex].mediumUrl || images[coverIndex].originalUrl : "";
  images.forEach(function (it, i) { it.isCover = i === coverIndex; });
  const video = normalizeVideo(m.video);
  return { images: images, coverImage: coverImage, video: video };
}

module.exports = { MAX_IMAGES: IMAGE_LIMIT, assertListingMedia, VIDEO_MIME };

