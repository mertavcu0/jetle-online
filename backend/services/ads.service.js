const mongoose = require("mongoose");
const { Ad, PLACEMENT_TYPES } = require("../models/Ad");
const { ApiError } = require("../utils/ApiError");

function toPublicDto(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    subtitle: doc.subtitle || "",
    description: doc.description || "",
    imageUrl: doc.imageUrl,
    mobileImageUrl: doc.mobileImageUrl || "",
    ctaText: doc.ctaText || "İncele",
    targetUrl: doc.targetUrl,
    placementType: doc.placementType,
    sponsorLabel: doc.sponsorLabel || "Sponsorlu",
    backgroundTone: doc.backgroundTone || "neutral",
    order: doc.order,
    startDate: doc.startDate,
    endDate: doc.endDate
  };
}

function toAdminDto(doc) {
  var o = toPublicDto(doc);
  o.isActive = !!doc.isActive;
  o.createdAt = doc.createdAt;
  o.updatedAt = doc.updatedAt;
  return o;
}

function activeDateFilter() {
  var now = new Date();
  return {
    isActive: true,
    $and: [
      {
        $or: [{ startDate: null }, { startDate: { $lte: now } }]
      },
      {
        $or: [{ endDate: null }, { endDate: { $gte: now } }]
      }
    ]
  };
}

async function listPublic(placementType) {
  var q = Object.assign({}, activeDateFilter());
  if (placementType) {
    if (PLACEMENT_TYPES.indexOf(placementType) === -1) {
      throw new ApiError(400, "Geçersiz placementType.");
    }
    q.placementType = placementType;
  }
  var docs = await Ad.find(q).sort({ order: 1, createdAt: -1 }).lean();
  return docs.map(toPublicDto);
}

async function listAllAdmin() {
  var docs = await Ad.find({}).sort({ placementType: 1, order: 1, createdAt: -1 }).lean();
  return docs.map(toAdminDto);
}

async function createAdmin(payload) {
  var doc = await Ad.create(normalizePayload(payload, true));
  return toAdminDto(doc);
}

async function updateAdmin(id, payload) {
  if (!mongoose.isValidObjectId(id)) return null;
  var patch = normalizePayload(payload, false);
  if (Object.keys(patch).length === 0) throw new ApiError(400, "Güncellenecek alan yok.");
  var doc = await Ad.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  return doc ? toAdminDto(doc) : null;
}

async function removeAdmin(id) {
  if (!mongoose.isValidObjectId(id)) return false;
  var r = await Ad.deleteOne({ _id: id });
  return r.deletedCount === 1;
}

async function toggleAdmin(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  var existing = await Ad.findById(id);
  if (!existing) return null;
  existing.isActive = !existing.isActive;
  await existing.save();
  return toAdminDto(existing);
}

function normalizePayload(body, isCreate) {
  var b = body && typeof body === "object" ? body : {};
  var pt = String(b.placementType || "").trim();
  if (isCreate && !pt) throw new ApiError(400, "placementType gerekli.");
  var out = {};
  if (b.title != null) out.title = String(b.title).trim().slice(0, 200);
  if (b.subtitle != null) out.subtitle = String(b.subtitle).trim().slice(0, 300);
  if (b.description != null) out.description = String(b.description).trim().slice(0, 2000);
  if (b.imageUrl != null) out.imageUrl = String(b.imageUrl).trim().slice(0, 2000);
  if (b.mobileImageUrl != null) out.mobileImageUrl = String(b.mobileImageUrl).trim().slice(0, 2000);
  if (b.ctaText != null) out.ctaText = String(b.ctaText).trim().slice(0, 80) || "İncele";
  if (b.targetUrl != null) out.targetUrl = String(b.targetUrl).trim().slice(0, 2000);
  if (b.placementType != null) {
    var p = String(b.placementType).trim();
    if (PLACEMENT_TYPES.indexOf(p) === -1) throw new ApiError(400, "Geçersiz placementType.");
    out.placementType = p;
  }
  if (b.isActive != null) out.isActive = !!b.isActive;
  if (b.order != null) out.order = Number(b.order) || 0;
  if (b.startDate !== undefined) out.startDate = parseOptionalDate(b.startDate);
  if (b.endDate !== undefined) out.endDate = parseOptionalDate(b.endDate);
  if (b.sponsorLabel != null) out.sponsorLabel = String(b.sponsorLabel).trim().slice(0, 40) || "Sponsorlu";
  if (b.backgroundTone != null) out.backgroundTone = String(b.backgroundTone).trim().slice(0, 40) || "neutral";
  if (isCreate) {
    if (!out.title) throw new ApiError(400, "title gerekli.");
    if (!out.imageUrl) throw new ApiError(400, "imageUrl gerekli.");
    if (!out.targetUrl) throw new ApiError(400, "targetUrl gerekli.");
    if (!out.placementType) out.placementType = pt;
  }
  return out;
}

function parseOptionalDate(v) {
  if (v === null || v === "") return null;
  var d = new Date(v);
  if (!isFinite(d.getTime())) throw new ApiError(400, "Geçersiz tarih.");
  return d;
}

module.exports = {
  listPublic,
  listAllAdmin,
  createAdmin,
  updateAdmin,
  removeAdmin,
  toggleAdmin,
  toPublicDto
};
