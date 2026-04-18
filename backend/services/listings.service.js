const { Listing } = require("../models/Listing");

const { ApiError } = require("../utils/ApiError");

const {

  applyNonAdminListingRules,

  normalizeInitialStatus,

  canOwnerSetStatus

} = require("../utils/listingPayloadPolicy");

const { assertListingMedia } = require("../utils/listingMediaPolicy");
const mediaService = require("./media.service");




function toPublicRow(doc) {
  var media = doc.media || { images: [], coverImage: "", video: null };
  var mediaImages = Array.isArray(media.images) ? media.images : [];
  var legacyImages = mediaImages.map(function (im) {
    if (!im || typeof im !== "object") return "";
    return im.mediumUrl || im.originalUrl || "";
  }).filter(Boolean);

  return {

    id: String(doc._id),

    ownerId: String(doc.ownerId),

    userId: String(doc.ownerId),

    category: doc.category,

    subcategory: doc.subcategory,

    categorySlug: doc.categorySlug || "",

    sellerName: doc.sellerName || "",

    title: doc.title,

    description: doc.description,

    price: doc.price,

    status: doc.status,

    phone: doc.phone || "",

    city: doc.city || "",

    district: doc.district || "",

    address: doc.address || "",

    lat: doc.lat,

    lng: doc.lng,

    images: legacyImages,
    coverImage: media.coverImage || legacyImages[0] || "",
    video: media.video || null,
    media: media,

    specs: doc.specs || {},

    featured: !!doc.featured,

    showcase: !!doc.showcase,

    urgent: !!doc.urgent,

    highlight: !!doc.highlight,

    featuredUntil: doc.featuredUntil,

    showcaseUntil: doc.showcaseUntil,

    createdAt: doc.createdAt,

    updatedAt: doc.updatedAt

  };

}



async function allPublic(query) {

  const filter = { status: "approved" };

  if (query && query.category) filter.category = query.category;

  const docs = await Listing.find(filter).sort({ showcase: -1, featured: -1, createdAt: -1 }).lean(false);

  return docs.map(toPublicRow);

}



async function byId(id) {

  const doc = await Listing.findById(id);

  return doc ? toPublicRow(doc) : null;

}



/** İlan detayı: yalnızca onaylı herkese açık; bekleyen / taslak / red / pasif yalnızca sahip veya admin. */

async function byIdForViewer(id, auth) {

  const doc = await Listing.findById(id);

  if (!doc) return null;

  var row = toPublicRow(doc);

  var st = doc.status;

  if (st === "approved") return row;

  if (!auth || !auth.userId) return null;

  if (auth.role === "admin") return row;

  if (String(doc.ownerId) === String(auth.userId)) return row;

  return null;

}



async function create(ownerId, payload, auth) {

  var role = auth && auth.role ? auth.role : "user";

  var body = role === "admin" ? Object.assign({}, payload) : applyNonAdminListingRules(Object.assign({}, payload));

  var status = normalizeInitialStatus(role, body.status != null ? body.status : payload.status);

  const media = body.media && typeof body.media === "object" ? body.media : {};

  var safeMedia = assertListingMedia(media);
  if (safeMedia.images.length) {
    safeMedia.images = await mediaService.resolveImageRefs(ownerId, safeMedia.images);
    var cix = safeMedia.images.findIndex(function (x) { return x.isCover; });
    safeMedia.coverImage = safeMedia.images[cix >= 0 ? cix : 0].mediumUrl;
  }
  safeMedia.video = await mediaService.resolveVideoRef(ownerId, safeMedia.video);

  const doc = await Listing.create({

    ownerId: ownerId,

    category: body.category,

    subcategory: body.subcategory,

    categorySlug: typeof body.categorySlug === "string" ? body.categorySlug.slice(0, 120) : "",

    sellerName: typeof body.sellerName === "string" ? body.sellerName.slice(0, 120) : "",

    title: body.title,

    description: body.description,

    price: Number(body.price || 0),

    status: status,

    phone: body.phone || "",

    city: body.city || "",

    district: body.district || "",

    address: body.address || "",

    lat: body.lat == null || body.lat === "" ? null : Number(body.lat),

    lng: body.lng == null || body.lng === "" ? null : Number(body.lng),

    media: safeMedia,


    specs: body.specs && typeof body.specs === "object" ? body.specs : {},

    featured: role === "admin" ? !!body.featured : false,

    showcase: role === "admin" ? !!body.showcase : false,

    urgent: role === "admin" ? !!body.urgent : false,

    highlight: role === "admin" ? !!body.highlight : false,

    featuredUntil: role === "admin" ? body.featuredUntil || null : null,

    showcaseUntil: role === "admin" ? body.showcaseUntil || null : null

  });

  return toPublicRow(doc);

}



async function update(id, payload, auth) {

  const existing = await Listing.findById(id);

  if (!existing) return null;

  var role = auth && auth.role ? auth.role : "user";

  var incoming = Object.assign({}, payload);

  if (role !== "admin") {

    incoming = applyNonAdminListingRules(incoming);

    if (incoming.status != null) {

      var nextSt = String(incoming.status).trim();

      if (!canOwnerSetStatus(existing.status, nextSt)) {

        delete incoming.status;

      }

    }

  }

  const media = incoming.media && typeof incoming.media === "object" ? incoming.media : null;

  const patch = {

    category: incoming.category,

    subcategory: incoming.subcategory,

    title: incoming.title,

    description: incoming.description,

    price: Number(incoming.price || 0),

    status: incoming.status != null ? incoming.status : existing.status,

    phone: incoming.phone || "",

    city: incoming.city || "",

    district: incoming.district || "",

    address: incoming.address || "",

    lat: incoming.lat == null || incoming.lat === "" ? null : Number(incoming.lat),

    lng: incoming.lng == null || incoming.lng === "" ? null : Number(incoming.lng),

    specs: incoming.specs && typeof incoming.specs === "object" ? incoming.specs : {}

  };

  if (role === "admin") {

    patch.featured = !!incoming.featured;

    patch.showcase = !!incoming.showcase;

    patch.urgent = !!incoming.urgent;

    patch.highlight = !!incoming.highlight;

    patch.featuredUntil = incoming.featuredUntil || null;

    patch.showcaseUntil = incoming.showcaseUntil || null;

  } else {

    patch.featured = !!existing.featured;

    patch.showcase = !!existing.showcase;

    patch.urgent = !!existing.urgent;

    patch.highlight = !!existing.highlight;

    patch.featuredUntil = existing.featuredUntil || null;

    patch.showcaseUntil = existing.showcaseUntil || null;

  }

  if (incoming.status == null) patch.status = existing.status;

  if (typeof incoming.categorySlug === "string") patch.categorySlug = incoming.categorySlug.slice(0, 120);

  if (typeof incoming.sellerName === "string") patch.sellerName = incoming.sellerName.slice(0, 120);

  if (media) {
    patch.media = assertListingMedia(media);
    if (patch.media.images.length) {
      patch.media.images = await mediaService.resolveImageRefs(existing.ownerId, patch.media.images);
      var cix2 = patch.media.images.findIndex(function (x) { return x.isCover; });
      patch.media.coverImage = patch.media.images[cix2 >= 0 ? cix2 : 0].mediumUrl;
    }
    patch.media.video = await mediaService.resolveVideoRef(existing.ownerId, patch.media.video);

  }


  const doc = await Listing.findByIdAndUpdate(id, patch, { new: true, runValidators: true });

  return doc ? toPublicRow(doc) : null;

}



async function byOwner(ownerId) {

  const docs = await Listing.find({ ownerId: ownerId }).sort({ updatedAt: -1 });

  return docs.map(toPublicRow);

}



async function updateStatusByOwner(listingId, ownerId, nextStatus) {

  const doc = await Listing.findById(listingId);

  if (!doc) return null;

  if (String(doc.ownerId) !== String(ownerId)) throw new ApiError(403, "Bu ilan size ait değil.");

  var next = String(nextStatus || "").trim();

  if (!canOwnerSetStatus(doc.status, next)) throw new ApiError(400, "Bu durum geçişi yapılamaz.");

  doc.status = next;

  await doc.save();

  return toPublicRow(doc);

}



async function deleteByOwner(listingId, ownerId) {

  const doc = await Listing.findById(listingId);

  if (!doc) return false;

  if (String(doc.ownerId) !== String(ownerId)) throw new ApiError(403, "Bu ilan size ait değil.");

  await Listing.deleteOne({ _id: doc._id });

  return true;

}

function toAdminListRow(doc) {
  var owner = doc.ownerId && typeof doc.ownerId === "object" && doc.ownerId._id ? doc.ownerId : null;
  var oid = owner ? String(owner._id) : String(doc.ownerId);
  return {
    id: String(doc._id),
    title: doc.title,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    owner: {
      id: oid,
      fullName: owner ? owner.fullName || "" : "",
      email: owner ? owner.email || "" : ""
    }
  };
}

async function listAllForAdmin() {
  const docs = await Listing.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "ownerId", select: "fullName email" })
    .lean();
  return docs.map(toAdminListRow);
}

async function setStatusByAdmin(listingId, status) {
  if (status !== "approved" && status !== "rejected") throw new ApiError(400, "Geçersiz durum.");
  const doc = await Listing.findByIdAndUpdate(
    listingId,
    { $set: { status: status } },
    { new: true, runValidators: true }
  );
  return doc ? toPublicRow(doc) : null;
}

async function deleteByAdmin(listingId) {
  const r = await Listing.deleteOne({ _id: listingId });
  return r.deletedCount === 1;
}



module.exports = {

  allPublic,

  byId,

  byIdForViewer,

  create,

  update,

  byOwner,

  updateStatusByOwner,

  deleteByOwner,

  listAllForAdmin,

  setStatusByAdmin,

  deleteByAdmin

};


