const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");
const isProduction = process.env.NODE_ENV === "production";
const activeUploadMap = new Map();
const MAX_CONCURRENT_UPLOADS = 3;

function sanitizeText(value, maxLength = 500) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizeHtmlLikeObject(input = {}) {
  const clone = { ...input };
  ["title", "description", "desc", "brand", "series", "model", "city", "district", "category", "subCategory", "color"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(clone, field)) {
      clone[field] = sanitizeText(clone[field], field === "description" || field === "desc" ? 5000 : 160);
    }
  });
  return clone;
}

function isPlaceholderImage(value) {
  const src = String(value || "").trim().toLowerCase();
  if (!src) return true;
  return [
    "picsum.photos",
    "images.unsplash.com",
    "source.unsplash.com"
  ].some((token) => src.includes(token));
}

function normalizeImageList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter((item) => item && !isPlaceholderImage(item));
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return normalizeImageList(parsed);
    } catch (_) {
      return raw
        .split(/[,|]/)
        .map((item) => item.trim())
        .filter((item) => item && !isPlaceholderImage(item));
    }
  }

  return [];
}

function listingToClient(doc) {
  const o = doc.toObject ? doc.toObject() : { ...doc };
  o.id = String(o._id);
  delete o._id;
  delete o.__v;
  return o;
}

function canModifyListing(listing, reqUser) {
  if (!listing || !reqUser) return false;
  if (reqUser.role === "admin") return true;
  if (listing.user && String(listing.user) === String(reqUser.id)) return true;
  return String(listing.userId) === String(reqUser.id);
}

async function generateUniqueListingNo() {
  let exists = true;
  let no;

  while (exists) {
    no = Math.floor(100000000 + Math.random() * 9000000000).toString();
    const found = await Listing.findOne({ listingNo: no });
    if (!found) exists = false;
  }

  return no;
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildListingQuery(req) {
  const query = {
    status: "approved",
    isDeleted: false
  };

  const search = String(req.query.q || req.query.search || "").trim();
  const city = String(req.query.city || req.query.location || "").trim();
  const category = String(req.query.category || "").trim();
  const min = Number(req.query.min || req.query.minPrice);
  const max = Number(req.query.max || req.query.maxPrice);

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { title: regex },
      { description: regex },
      { desc: regex },
      { listingNo: regex }
    ];
  }

  if (city) {
    const regex = new RegExp(escapeRegex(city), "i");
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { city: regex },
        { location: regex }
      ]
    });
  }

  if (category) {
    const normalized = category.toLocaleLowerCase("tr");
    const categories = [category];

    if (
      normalized.includes("oto") ||
      normalized.includes("araç") ||
      normalized.includes("arac") ||
      normalized.includes("vasıta") ||
      normalized.includes("vasita")
    ) {
      categories.push("Araç", "Vasıta");
    }

    query.category = {
      $in: categories.map((item) => new RegExp("^" + escapeRegex(item) + "$", "i"))
    };
  }

  if (!Number.isNaN(min) || !Number.isNaN(max)) {
    query.price = {};
    if (!Number.isNaN(min)) query.price.$gte = min;
    if (!Number.isNaN(max)) query.price.$lte = max;
  }

  return query;
}

function normalizeListingItem(raw) {
  if (!raw || typeof raw !== "object") return null;

  const item = raw.toObject ? raw.toObject() : { ...raw };
  const photos = normalizeImageList(item.photos);
  const images = normalizeImageList(item.images);
  const mergedImages = [...new Set([...images, ...photos])];
  const image = !isPlaceholderImage(item.image) ? String(item.image || "").trim() : "";
  const primaryImage = image || mergedImages[0] || "";

  const createdAt = item.createdAt ? new Date(item.createdAt) : null;
  const createdAtMs = createdAt && !Number.isNaN(createdAt.getTime())
    ? createdAt.getTime()
    : 0;

  return {
    ...item,
    image: primaryImage,
    images: mergedImages,
    photos: mergedImages,
    favorites: Array.isArray(item.favorites) ? item.favorites : [],
    views: Number(item.views || 0),
    isFeatured: Boolean(item.isFeatured),
    isBoosted: Boolean(item.isBoosted),
    score:
      (item.isFeatured ? 120 : 0) +
      (item.isBoosted ? 60 : 0) +
      (Number(item.views || 0) * 2) +
      ((Date.now() - createdAtMs) < 3 * 86400000 ? 20 : 0)
  };
}

async function findListingsSafe(query, options = {}) {
  const baseQuery = Listing.find(query);

  if (options.sort) {
    baseQuery.sort(options.sort);
  }

  if (options.limit) {
    baseQuery.limit(options.limit);
  }

  try {
    return await baseQuery
      .populate("user", "name email")
      .populate("favorites", "email")
      .lean();
  } catch (populateErr) {
    console.error("LISTINGS POPULATE FALLBACK:", populateErr);

    const fallbackQuery = Listing.find(query);
    if (options.sort) fallbackQuery.sort(options.sort);
    if (options.limit) fallbackQuery.limit(options.limit);
    return await fallbackQuery.lean();
  }
}

function getUploadKey(req) {
  const userId = String(req.user?.id || req.user?._id || "").trim();
  return userId || String(req.ip || "unknown");
}

function releaseUploadSlot(key) {
  const current = Number(activeUploadMap.get(key) || 0);
  if (current <= 1) {
    activeUploadMap.delete(key);
    return;
  }
  activeUploadMap.set(key, current - 1);
}

function withUploadGuard(req, res, next) {
  const key = getUploadKey(req);
  const current = Number(activeUploadMap.get(key) || 0);

  if (current >= MAX_CONCURRENT_UPLOADS) {
    return res.status(429).json({ error: "too_many_requests" });
  }

  activeUploadMap.set(key, current + 1);
  let released = false;
  const cleanup = () => {
    if (released) return;
    released = true;
    releaseUploadSlot(key);
  };

  res.on("finish", cleanup);
  res.on("close", cleanup);
  next();
}
router.post(
  "/upload",
  authMiddleware,
  withUploadGuard,
  function (req, res, next) {
    upload.array("images", 10)(req, res, function (err) {
      if (err) return res.status(400).json({ msg: err.message || "upload hatası" });
      next();
    });
  },
  function (req, res) {
    Promise.resolve(upload.optimizeFiles(req.files || []))
      .catch(() => [])
      .then((thumbs) => {
        const urls = (req.files || []).map(function (f) {
          return "/uploads/" + f.filename;
        });
        const thumbnailUrls = (thumbs || []).map((item) => item.thumbnailUrl).filter(Boolean);
        res.json({ urls, thumbnailUrls });
      });
  }
);

router.post("/", authMiddleware, withUploadGuard, function (req, res, next) {
  upload.array("images", 20)(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message || "upload_error" });
    }
    next();
  });
}, async (req, res) => {
  try {
    req.body = sanitizeHtmlLikeObject(req.body);
    await upload.optimizeFiles(req.files || []);
    const imageUrls = (req.files || []).map((file) => "/uploads/" + file.filename);
    const currentUserId = String(req.user?.id || req.user?._id || "").trim();
    const currentUserEmail = String(req.user?.email || "").trim().toLowerCase();
    const title = sanitizeText(req.body.title, 160);
    const description = sanitizeText(req.body.description || req.body.desc, 5000);
    const {
      price,
      category,
      subCategory,
      brand,
      series,
      model,
      year,
      km,
      fuel,
      transmission,
      bodyType,
      color,
      engineSize,
      enginePower,
      damage,
      features,
      kaput,
      tavan,
      bagaj,
      sag_on_camurluk,
      sol_on_camurluk,
      sag_on_kapi,
      sol_on_kapi,
      sag_arka_kapi,
      sol_arka_kapi,
      sellerType,
      city,
      district,
      images,
      photos
    } = req.body;
    const bodyImages = normalizeImageList(images || photos);
    const listingImages = imageUrls.length ? imageUrls : bodyImages;

    if (!title || title.length < 3 || title.length > 160) {
      return res.status(400).json({ error: "invalid_title" });
    }

    if (!description || description.length < 10 || description.length > 5000) {
      return res.status(400).json({ error: "invalid_description" });
    }

    if (!category || !city) {
      return res.status(400).json({ error: "invalid_listing" });
    }

    const listing = new Listing({
      ...req.body,
      title,
      description,
      price,
      category,
      subCategory,
      brand,
      series,
      model,
      year,
      km,
      fuel,
      transmission,
      bodyType,
      color,
      engineSize,
      enginePower,
      damage,
      features,
      kaput,
      tavan,
      bagaj,
      sag_on_camurluk,
      sol_on_camurluk,
      sag_on_kapi,
      sol_on_kapi,
      sag_arka_kapi,
      sol_arka_kapi,
      sellerType,
      city,
      district,
      image: listingImages[0] || "",
      images: listingImages,
      photos: listingImages,
      listingNo: req.body.listingNo || await generateUniqueListingNo(),
      status: "pending",
      isFeatured: false,
      user: currentUserId || undefined,
      userEmail: currentUserEmail || undefined
    });

    if (title.length < 3 || description.length < 10) {
      listing.isSuspicious = true;
    }

    await listing.save();
    await Notification.create({
      message: "Yeni ilan eklendi",
      type: "listing"
    });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("LISTING CREATE ERROR:", err);
    res.status(500).json({
      error: "server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const query = buildListingQuery(req);

    await Listing.updateMany(
      { isBoosted: true, boostUntil: { $lt: now } },
      { $set: { isBoosted: false } }
    );

    await Listing.updateMany(
      { isFeatured: true, featuredUntil: { $lt: now } },
      { $set: { isFeatured: false } }
    );

    if (req.query.popular === "true") {
      const rawListings = await findListingsSafe(query, {
        sort: { views: -1 },
        limit: 10
      });

      const listings = rawListings
        .map((item) => {
          try {
            return normalizeListingItem(item);
          } catch (itemErr) {
            console.error("LISTING ITEM SKIPPED:", itemErr, item?._id || item?.id || "unknown");
            return null;
          }
        })
        .filter(Boolean);

      return res.json(listings);
    }

    const rawListings = await findListingsSafe(query);
    const listings = rawListings
      .map((item) => {
        try {
          return normalizeListingItem(item);
        } catch (itemErr) {
          console.error("LISTING ITEM SKIPPED:", itemErr, item?._id || item?.id || "unknown");
          return null;
        }
      })
      .filter(Boolean);

    listings.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));

    res.json(listings);
  } catch (err) {
    console.error("LISTINGS ERROR REAL:", err);
    res.status(200).json([]);
  }
});

router.get("/my-listings", authMiddleware, async (req, res) => {
  try {
    const currentUserId = String(req.user?.id || req.user?._id || "").trim();
    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const listings = await Listing.find({ user: currentUserId, isDeleted: false });

    res.json(listings);
  } catch (err) {
    console.error("MY LISTINGS ERROR:", err);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/favorite/:id", authMiddleware, async (req, res) => {
  try {
    const listingId = String(req.params.id || "");
    const userId = String(req.user?.id || req.user?._id || "").trim();
    if (!mongoose.Types.ObjectId.isValid(listingId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "invalid_id" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exists = (user.favorites || []).some((id) => String(id) === listingId);
    if (exists) {
      user.favorites = user.favorites.filter((id) => String(id) !== listingId);
    } else {
      user.favorites.push(listingId);
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const userId = String(req.user?.id || req.user?._id || "").trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const user = await User.findById(userId).populate({
      path: "favorites",
      match: { isDeleted: false }
    });
    if (!user) return res.json([]);

    res.json(Array.isArray(user.favorites) ? user.favorites : []);
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/user/:id", async (req, res) => {
  const listings = await Listing.find({ user: req.params.id, isDeleted: false });
  res.json(listings);
});

router.patch("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const user = await User.findById(req.user.id || req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const exists = listing.favorites.some((id) => id.toString() === user._id.toString());

    if (exists) {
      listing.favorites = listing.favorites.filter((id) => id.toString() !== user._id.toString());
    } else {
      listing.favorites.push(user._id);
    }

    await listing.save();

    res.json({
      success: true,
      favorited: !exists,
      count: listing.favorites.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const user = await User.findById(req.user.id || req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const exists = listing.favorites.some((id) => id.toString() === user._id.toString());

    if (exists) {
      listing.favorites = listing.favorites.filter((id) => id.toString() !== user._id.toString());
    } else {
      listing.favorites.push(user._id);
    }

    await listing.save();

    res.json({
      success: true,
      favorited: !exists,
      count: listing.favorites.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/view", async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 }
  });
  res.json({ ok: true });
});

router.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("user");

  if (!listing) {
    return res.status(404).json({ error: "İlan bulunamadı" });
  }

  res.json(listing);
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = String(req.params.id || "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "not found" });
    }

    if (!canModifyListing(listing, req.user)) {
      return res.status(403).json({ error: "forbidden" });
    }

    const sanitizedBody = sanitizeHtmlLikeObject(req.body);
    if (Object.prototype.hasOwnProperty.call(sanitizedBody, "title")) {
      sanitizedBody.title = sanitizeText(sanitizedBody.title, 160);
      if (!sanitizedBody.title || sanitizedBody.title.length < 3) {
        return res.status(400).json({ error: "invalid_title" });
      }
    }

    if (Object.prototype.hasOwnProperty.call(sanitizedBody, "description") || Object.prototype.hasOwnProperty.call(sanitizedBody, "desc")) {
      const nextDescription = sanitizeText(sanitizedBody.description || sanitizedBody.desc, 5000);
      if (!nextDescription || nextDescription.length < 10) {
        return res.status(400).json({ error: "invalid_description" });
      }
      sanitizedBody.description = nextDescription;
      sanitizedBody.desc = nextDescription;
    }

    const updated = await Listing.findByIdAndUpdate(
      id,
      sanitizedBody,
      { new: true }
    );

    res.json({ success: true, listing: updated });
  } catch (err) {
    res.status(500).json({
      error: "Update failed",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.delete("/:id", authMiddleware, async function (req, res) {
  try {
    const id = String(req.params.id || "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "invalid id" });
    }
    const listing = await Listing.findById(id).exec();
    if (!listing) return res.status(404).json({ msg: "not found" });
    if (!canModifyListing(listing, req.user)) {
      return res.status(403).json({ msg: "forbidden" });
    }
    listing.isDeleted = true;
    await listing.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({
      msg: "server_error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

module.exports = router;



