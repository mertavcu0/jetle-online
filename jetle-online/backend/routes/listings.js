const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");
const storage = require("../services/storage");
const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = String(process.env.JWT_SECRET || "").trim();
const activeUploadMap = new Map();
const MAX_CONCURRENT_UPLOADS = 3;
const OPEN_BETA_MODE = String(process.env.OPEN_BETA_MODE || "").trim().toLowerCase() === "true";

function getListingAccessPolicy({ userRole = "user", sellerType = "" } = {}) {
  if (OPEN_BETA_MODE) {
    return {
      allowed: true,
      betaMode: true,
      requiresPayment: false,
      unlimitedListings: true,
      listingLimit: null,
      userRole: String(userRole || "").trim().toLowerCase() || "user",
      sellerType: String(sellerType || "").trim().toLowerCase()
    };
  }

  return {
    allowed: true,
    betaMode: false,
    requiresPayment: false,
    unlimitedListings: false,
    listingLimit: null,
    userRole: String(userRole || "").trim().toLowerCase() || "user",
    sellerType: String(sellerType || "").trim().toLowerCase()
  };
}

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

async function resolveOptionalRequestUser(req) {
  const authHeader = String(req.header("Authorization") || "").trim();
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded?.id) return null;

    const user = await User.findById(decoded.id).select("_id name email role banned isBanned");
    if (!user || user.banned || user.isBanned) return null;

    const normalizedRole = typeof User.normalizeUserRole === "function"
      ? User.normalizeUserRole(user.role)
      : String(user.role || "").trim().toLowerCase() || "user";

    return {
      id: String(user._id),
      _id: String(user._id),
      name: user.name || "",
      email: user.email || "",
      role: normalizedRole || "user"
    };
  } catch (_) {
    return null;
  }
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

async function getUserFavoriteCount(listingId) {
  if (!mongoose.Types.ObjectId.isValid(String(listingId || ""))) return 0;
  return User.countDocuments({ favorites: listingId });
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

function normalizeCategoryToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferMainCategory(...values) {
  for (const value of values) {
    const normalized = normalizeCategoryToken(value);
    if (!normalized) continue;

    if (["vasita", "otomobil", "arac", "araba", "suv", "motosiklet", "pickup", "kamyonet"].includes(normalized)) {
      return "vasita";
    }

    if (["emlak", "arsa", "daire", "villa", "isyeri", "mustakil-ev", "rezidans"].includes(normalized)) {
      return "emlak";
    }

    if (["yedek-parca", "yedek-parca-ve-aksesuar", "aksesuar", "lastik-jant", "oto-aksesuar"].includes(normalized)) {
      return "yedek-parca";
    }

    if (["is-makineleri", "is-makinalari", "is-makinasi", "is-makinesi"].includes(normalized)) {
      return "is-makineleri";
    }
  }

  return "";
}

function inferSubCategory(rawSubCategory, rawCategory, mainCategory) {
  const subCategory = String(rawSubCategory || "").trim();
  if (subCategory) return subCategory;

  const category = String(rawCategory || "").trim();
  if (!category) return "";

  const normalizedCategory = normalizeCategoryToken(category);
  if (!normalizedCategory || normalizedCategory === mainCategory) return "";

  return category;
}

function buildPublicVisibilityQuery() {
  return {
    approved: true,
    isActive: true,
    isDeleted: false,
    $or: [
      { status: "approved" },
      { status: "active" }
    ]
  };
}

function buildListingQuery(req) {
  const query = buildPublicVisibilityQuery();

  const search = String(req.query.q || req.query.search || "").trim();
  const city = String(req.query.city || req.query.location || "").trim();
  const category = String(req.query.category || "").trim();
  const showcaseOnly = String(req.query.showcase || "").trim().toLowerCase() === "true";
  const featuredOnly = String(req.query.featured || "").trim().toLowerCase() === "true";
  const normalOnly = String(req.query.normal || "").trim().toLowerCase() === "true";
  const min = Number(req.query.min || req.query.minPrice);
  const max = Number(req.query.max || req.query.maxPrice);

  if (showcaseOnly) {
    query.isShowcase = true;
    query.isFeatured = false;
  }

  if (featuredOnly) {
    query.isFeatured = true;
    query.isShowcase = false;
  }

  if (normalOnly) {
    query.isShowcase = false;
    query.isFeatured = false;
  }

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
    const mainCategory = inferMainCategory(category);
    const categoryRegex = new RegExp("^" + escapeRegex(category) + "$", "i");

    if (mainCategory) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { mainCategory: mainCategory },
          { category: new RegExp("^" + escapeRegex(mainCategory) + "$", "i") },
          { subCategory: categoryRegex }
        ]
      });
    } else {
      query.category = categoryRegex;
    }
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
  const mainCategory = inferMainCategory(item.mainCategory, item.category, item.subCategory, item.type);
  const subCategory = inferSubCategory(item.subCategory, item.category, mainCategory);

  const createdAt = item.createdAt ? new Date(item.createdAt) : null;
  const createdAtMs = createdAt && !Number.isNaN(createdAt.getTime())
    ? createdAt.getTime()
    : 0;

  console.log("LISTING_CATEGORY_DEBUG", JSON.stringify({
    id: String(item._id || item.id || ""),
    category: item.category || "",
    mainCategory,
    subCategory,
    type: item.type || ""
  }, null, 2));

  return {
    ...item,
    mainCategory,
    subCategory,
    image: primaryImage,
    images: mergedImages,
    photos: mergedImages,
    isShowcase: Boolean(item.isShowcase),
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
  const baseQuery = Listing.find(query).setOptions({ sanitizeFilter: false });

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

    const fallbackQuery = Listing.find(query).setOptions({ sanitizeFilter: false });
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
  console.log("UPLOAD_GUARD_CHECK", { key, current, max: MAX_CONCURRENT_UPLOADS });

  if (current >= MAX_CONCURRENT_UPLOADS) {
    console.error("UPLOAD_400_GUARD", { key, current, max: MAX_CONCURRENT_UPLOADS });
    return res.status(429).json({ error: "too_many_requests" });
  }

  activeUploadMap.set(key, current + 1);
  console.log("UPLOAD_GUARD_OK", { key, nextCount: current + 1 });
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
  function (req, res, next) {
    console.log("UPLOAD_AUTH_OK", {
      userId: String(req.user?.id || req.user?._id || ""),
      email: String(req.user?.email || "")
    });
    next();
  },
  withUploadGuard,
  upload.array("images", 30),
  async function (req, res, next) {
    console.log("UPLOAD_ROUTE_START");
    console.log("UPLOAD_REQ_BODY", JSON.stringify(req.body || {}, null, 2));
    console.log("UPLOAD_REQ_FILES", JSON.stringify(req.files || [], null, 2));
    console.log("UPLOAD_REQ_FILES_FULL", JSON.stringify(req.files || [], null, 2));
    console.log("UPLOAD_MIDDLEWARE_OK");

    try {
      console.log("UPLOAD_FILE_MAP_START");
      const thumbs = await Promise.resolve(upload.optimizeFiles(req.files || [])).catch(() => []);
      console.log("UPLOAD_FILE_MAP_DONE", JSON.stringify(thumbs || [], null, 2));
      const { urls, thumbnailUrls, publicIds, assets, provider } = await storage.storeFiles(req.files || [], thumbs);

      console.log("UPLOAD_SAVED_FILES", JSON.stringify({
        urls,
        thumbnailUrls,
        publicIds,
        assets,
        provider,
        files: (req.files || []).map((file) => ({
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          filename: file.filename,
          path: file.path
        }))
      }, null, 2));

      const responsePayload = { urls, thumbnailUrls, publicIds, assets, provider };
      console.log("UPLOAD_RESPONSE_READY", JSON.stringify(responsePayload, null, 2));
      console.log("UPLOAD_RESPONSE", JSON.stringify(responsePayload, null, 2));
      console.log("UPLOAD_ROUTE_SUCCESS");
      return res.json(responsePayload);
    } catch (err) {
      console.error("UPLOAD_400_UNKNOWN", err?.message || err);
      return next(err);
    }
  },
  function (err, req, res, next) {
    console.error("UPLOAD_FATAL", err);
    if (res.headersSent) return next(err);
    return res.status(500).json({
      success: false,
      error: String(err?.message || err)
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
    console.log("CREATE_REQ_BODY_RAW", JSON.stringify(req.body, null, 2));
    const body = { ...req.body };
    const thumbResults = await upload.optimizeFiles(req.files || []);
    const storedFiles = await storage.storeFiles(req.files || [], thumbResults);
    const imageUrls = Array.isArray(storedFiles.urls) ? storedFiles.urls : [];
    const imagePublicIds = Array.isArray(storedFiles.publicIds) ? storedFiles.publicIds : [];
    const currentUserId = String(req.user?.id || req.user?._id || "").trim();
    const currentUserEmail = String(req.user?.email || "").trim().toLowerCase();
    const listingAccessPolicy = getListingAccessPolicy({
      userRole: req.user?.role,
      sellerType: req.body?.sellerType
    });
    if (listingAccessPolicy.betaMode) {
      console.log("OPEN_BETA_MODE_ACTIVE", JSON.stringify(listingAccessPolicy, null, 2));
      console.log("UNLIMITED_FREE_LISTINGS_ENABLED", JSON.stringify({
        userId: currentUserId,
        userRole: listingAccessPolicy.userRole,
        sellerType: listingAccessPolicy.sellerType
      }, null, 2));
      console.log("LISTING_LIMIT_BYPASSED", JSON.stringify({
        userId: currentUserId,
        userRole: listingAccessPolicy.userRole,
        sellerType: listingAccessPolicy.sellerType
      }, null, 2));
    }
    const title = sanitizeText(body.title, 160);
    const rawDescriptionValue =
      body.description ??
      body.desc ??
      body.content ??
      body.details ??
      "";
    const description = sanitizeText(rawDescriptionValue, 5000);
    console.log("DESCRIPTION_RAW", JSON.stringify({
      description: body.description,
      desc: body.desc,
      content: body.content,
      details: body.details
    }, null, 2));
    console.log("DESCRIPTION_TYPE", typeof rawDescriptionValue);
    console.log("DESCRIPTION_LENGTH", String(rawDescriptionValue || "").length);
    console.log("DESCRIPTION_AFTER_TRIM", description);
    console.log("DESCRIPTION_VALIDATION_RESULT", JSON.stringify({
      hasDescription: Boolean(description),
      length: String(description || "").length,
      min: 10,
      max: 5000
    }, null, 2));
    const {
      price,
      category,
      mainCategory,
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
      coverImage,
      mainImage,
      gallery,
      images,
      photos,
      image
    } = body;
    const normalizedImages = normalizeImageList(images);
    const normalizedPhotos = normalizeImageList(photos);
    const normalizedGallery = normalizeImageList(gallery);
    const fallbackImages = normalizeImageList([coverImage, mainImage, image].filter(Boolean));
    const baseImageChain =
      normalizedImages.length ? normalizedImages :
      normalizedPhotos.length ? normalizedPhotos :
      normalizedGallery.length ? normalizedGallery :
      fallbackImages;
    const listingImages = imageUrls.length ? imageUrls : baseImageChain;
    const primaryImage = listingImages[0] || "";
    const finalGallery = imageUrls.length ? listingImages : (normalizedGallery.length ? normalizedGallery : listingImages);
    const finalImages = imageUrls.length ? listingImages : (normalizedImages.length ? normalizedImages : listingImages);
    const finalPhotos = imageUrls.length ? listingImages : (normalizedPhotos.length ? normalizedPhotos : listingImages);
    const finalCoverImage = imageUrls.length ? primaryImage : (String(coverImage || "").trim() || primaryImage);
    const finalMainImage = imageUrls.length ? primaryImage : (String(mainImage || "").trim() || primaryImage);
    const finalImage = imageUrls.length ? primaryImage : (String(image || "").trim() || primaryImage);
    const uploadProvider = String(storedFiles.provider || "local").trim() || "local";

    const standardizedMainCategory = inferMainCategory(mainCategory, category, subCategory, body.type);
    const standardizedSubCategory = inferSubCategory(subCategory, category, standardizedMainCategory);

    console.log("CREATE_CATEGORY_RAW", JSON.stringify({
      category: body.category,
      mainCategory: body.mainCategory,
      subCategory: body.subCategory,
      type: body.type || ""
    }, null, 2));
    console.log("CREATE_MAIN_CATEGORY", standardizedMainCategory);
    console.log("CREATE_SUBCATEGORY", standardizedSubCategory);
    console.log("CATEGORY_STANDARDIZED", JSON.stringify({
      input: {
        category: body.category,
        mainCategory: body.mainCategory,
        subCategory: body.subCategory
      },
      output: {
        mainCategory: standardizedMainCategory,
        subCategory: standardizedSubCategory
      }
    }, null, 2));

    body.coverImage = finalCoverImage;
    body.mainImage = finalMainImage;
    body.image = finalImage;
    body.gallery = finalGallery;
    body.images = finalImages;
    body.photos = finalPhotos;
    body.title = title;
    body.description = description;
    body.price = price;
    body.category = standardizedMainCategory || category;
    body.mainCategory = standardizedMainCategory || category;
    body.subCategory = standardizedSubCategory;
    body.brand = brand;
    body.series = series;
    body.model = model;
    body.year = year;
    body.km = km;
    body.fuel = fuel;
    body.transmission = transmission;
    body.bodyType = bodyType;
    body.color = color;
    body.engineSize = engineSize;
    body.enginePower = enginePower;
    body.damage = damage;
    body.features = features;
    body.kaput = kaput;
    body.tavan = tavan;
    body.bagaj = bagaj;
    body.sag_on_camurluk = sag_on_camurluk;
    body.sol_on_camurluk = sol_on_camurluk;
    body.sag_on_kapi = sag_on_kapi;
    body.sol_on_kapi = sol_on_kapi;
    body.sag_arka_kapi = sag_arka_kapi;
    body.sol_arka_kapi = sol_arka_kapi;
    body.sellerType = sellerType;
    body.city = city;
    body.district = district;
    body.imagePublicIds = imagePublicIds;
    body.uploadProvider = uploadProvider;
    body.listingNo = body.listingNo || await generateUniqueListingNo();
    body.approved = false;
    body.status = "pending";
    body.isActive = false;
    body.isShowcase = false;
    body.isFeatured = false;
    body.user = currentUserId || undefined;
    body.userEmail = currentUserEmail || undefined;
    console.log("MODERATION_CREATE", JSON.stringify({
      approved: body.approved,
      status: body.status,
      isActive: body.isActive,
      isShowcase: body.isShowcase,
      isFeatured: body.isFeatured
    }, null, 2));
    console.log("LISTING_APPROVAL_STATUS", JSON.stringify({
      approved: body.approved,
      status: body.status,
      isActive: body.isActive
    }, null, 2));

    console.log("CREATE_REQ_BODY_NORMALIZED", JSON.stringify(body, null, 2));

    const createData = {
      approved: body.approved,
      status: body.status,
      isActive: body.isActive,
      isShowcase: body.isShowcase,
      isFeatured: body.isFeatured,
      images: body.images,
      photos: body.photos,
      gallery: body.gallery,
      image: body.image,
      coverImage: body.coverImage,
      mainImage: body.mainImage
    };

    console.log("CREATE_MONGO_INPUT", JSON.stringify(createData, null, 2));

    if (!title || title.length < 3 || title.length > 160) {
      return res.status(400).json({ error: "invalid_title" });
    }

    if (!description || description.length < 10 || description.length > 5000) {
      const reason =
        !description ? "description_empty_after_trim" :
        description.length < 10 ? "description_too_short" :
        "description_too_long";
      console.error("DESCRIPTION_VALIDATION_FAIL", {
        reason,
        length: description?.length || 0
      });
      return res.status(400).json({
        error: "invalid_description",
        reason,
        length: description?.length || 0
      });
    }

    if (!category || !city) {
      return res.status(400).json({ error: "invalid_listing" });
    }

    const listing = new Listing({
      ...body
    });

    if (title.length < 3 || description.length < 10) {
      listing.isSuspicious = true;
    }

    await listing.save();
    const savedListing = listing.toObject ? listing.toObject() : listing;
    console.log("CREATE_SAVED_LISTING", JSON.stringify(savedListing, null, 2));
    console.log("CREATE_SAVED_KEYS", Object.keys(savedListing));
    console.log("LISTING_APPROVAL_STATUS", JSON.stringify({
      id: String(savedListing._id || ""),
      approved: savedListing.approved,
      status: savedListing.status,
      isActive: savedListing.isActive
    }, null, 2));
    console.log("MONGO_SAVED_RESULT", {
      id: listing._id,
      images: listing.images,
      gallery: listing.gallery,
      image: listing.image,
      coverImage: listing.coverImage,
      mainImage: listing.mainImage
    });
    await Notification.create({
      message: "Yeni ilan eklendi",
      type: "listing"
    });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("LISTING CREATE ERROR REAL:", {
      message: err?.message || "unknown_error",
      stack: err?.stack || "",
      bodyKeys: Object.keys(req.body || {}),
      fileCount: Array.isArray(req.files) ? req.files.length : 0,
      hasCloudinaryUrl: Boolean(String(process.env.CLOUDINARY_URL || "").trim()),
      hasCloudinaryParts: Boolean(
        String(process.env.CLOUDINARY_CLOUD_NAME || "").trim() &&
        String(process.env.CLOUDINARY_API_KEY || "").trim() &&
        String(process.env.CLOUDINARY_API_SECRET || "").trim()
      )
    });
    res.status(500).json({
      success: false,
      error: "listing_create_failed",
      message: "İlan kaydedilemedi",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const query = buildListingQuery(req);

    await Listing.updateMany(
      { isBoosted: true, boostUntil: mongoose.trusted({ $lt: now }) },
      { $set: { isBoosted: false } }
    ).setOptions({ sanitizeFilter: false });

    await Listing.updateMany(
      { isFeatured: true, featuredUntil: mongoose.trusted({ $lt: now }) },
      { $set: { isFeatured: false } }
    ).setOptions({ sanitizeFilter: false });

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
  try {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.id || ""))) {
      return res.status(400).json({ error: "invalid_id" });
    }

    const listings = await Listing.find({
      ...buildPublicVisibilityQuery(),
      user: req.params.id
    });

    res.json(listings);
  } catch (err) {
    console.error("PUBLIC USER LISTINGS ERROR:", err);
    res.status(500).json({ error: "server_error" });
  }
});

router.patch("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const listingId = String(req.params.id || "");
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: "invalid_id" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    const exists = (user.favorites || []).some((id) => String(id) === listingId);
    if (exists) {
      user.favorites = (user.favorites || []).filter((id) => String(id) !== listingId);
    } else {
      user.favorites = [...(user.favorites || []), listing._id];
    }

    await user.save();

    res.json({
      success: true,
      favorited: !exists,
      count: await getUserFavoriteCount(listingId)
    });
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const listingId = String(req.params.id || "");
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: "invalid_id" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    const exists = (user.favorites || []).some((id) => String(id) === listingId);
    if (exists) {
      user.favorites = (user.favorites || []).filter((id) => String(id) !== listingId);
    } else {
      user.favorites = [...(user.favorites || []), listing._id];
    }

    await user.save();

    res.json({
      success: true,
      favorited: !exists,
      count: await getUserFavoriteCount(listingId)
    });
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/:id/view", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.id || ""))) {
      return res.status(400).json({ error: "invalid_id" });
    }

    await Listing.findOneAndUpdate(
      {
        _id: req.params.id,
        ...buildPublicVisibilityQuery()
      },
      { $inc: { views: 1 } }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("LISTING VIEW ERROR:", err);
    res.status(500).json({ error: "server_error" });
  }
});

router.get("/:id", async (req, res) => {
  console.log("DETAIL_ROUTE_ENTRY", {
    id: String(req.params.id || "")
  });
  console.log("LISTING_ROUTE_MIDDLEWARE_STAGE", "detail_route_start");
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id || ""))) {
    return res.status(404).json({ error: "İlan bulunamadı" });
  }

  const listing = await Listing.findById(req.params.id).populate("user");
  console.log("LISTING_ROUTE_MIDDLEWARE_STAGE", "after_findById_populate");

  if (!listing || listing.isDeleted) {
    return res.status(404).json({ error: "İlan bulunamadı" });
  }

  const normalizedStatus = String(listing.status || "").trim().toLowerCase();
  const hasApprovedField = typeof listing.approved !== "undefined";
  const hasStatusField = typeof listing.status !== "undefined" && listing.status !== null && String(listing.status).trim() !== "";
  const hasIsActiveField = typeof listing.isActive !== "undefined";
  const isRejected = normalizedStatus === "rejected";
  const isPending = normalizedStatus === "pending";
  const isDraft = normalizedStatus === "draft";
  const isApprovedStatus = normalizedStatus === "approved" || normalizedStatus === "active";
  const isLegacyListing = !hasStatusField && !hasIsActiveField && !hasApprovedField;
  const isPubliclyVisible = isLegacyListing
    ? true
    : Boolean(listing.approved === true && listing.isActive === true && isApprovedStatus);
  const isActiveExplicitFalse = listing.isActive === false;
  const isExplicitlyBlocked = !isPubliclyVisible;

  console.log("DETAIL_VISIBILITY_VALUES", {
    status: listing.status,
    approved: listing.approved,
    isActive: listing.isActive
  });

  console.log("DETAIL_VISIBILITY_CHECK", JSON.stringify({
    id: String(listing._id || ""),
    approved: listing.approved,
    status: listing.status,
    isActive: listing.isActive,
    hasApprovedField,
    hasStatusField,
    hasIsActiveField,
    isLegacyListing,
    publicVisible: isPubliclyVisible,
    isActiveExplicitFalse,
    isRejected,
    isPending,
    isDraft
  }, null, 2));

  console.log("DETAIL_VISIBILITY_RESULT", {
    id: String(listing._id || ""),
    isExplicitlyBlocked,
    isLegacyListing,
    isPubliclyVisible
  });

  if (isPubliclyVisible) {
    if (isLegacyListing) {
      console.log("DETAIL_LEGACY_ALLOWED", {
        id: String(listing._id || ""),
        status: listing.status,
        approved: listing.approved,
        isActive: listing.isActive
      });
    }
    console.log("DETAIL_PUBLIC_ALLOWED", {
      id: String(listing._id || ""),
      status: normalizedStatus || "legacy",
      approved: listing.approved,
      isActive: listing.isActive,
      isLegacyListing
    });
  }

  if (!isPubliclyVisible) {
    console.log("DETAIL_BLOCK_REASON", {
      id: String(listing._id || ""),
      status: listing.status,
      approved: listing.approved,
      isActive: listing.isActive,
      isRejected,
      isPending,
      isDraft,
      isActiveExplicitFalse
    });
    console.log("LISTING_ROUTE_MIDDLEWARE_STAGE", "pending_visibility_check");
    const requestUser = await resolveOptionalRequestUser(req);
    if (requestUser) req.user = requestUser;
    const isAdmin = requestUser?.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({ error: "İlan yayında değil" });
    }
  }

  console.log("LISTING_ROUTE_MIDDLEWARE_STAGE", "before_toObject");
  console.log({
    listingId: String(listing._id || ""),
    status: String(listing.status || ""),
    userRole: req.user?.role || null,
    allowPending: true
  });
  console.log("DETAIL_REQUEST_INSTANCE", Date.now());

  console.log("DB_RAW_LISTING", listing);
  const listingData = listing.toObject ? listing.toObject() : { ...listing };
  console.log("DB_TO_OBJECT", listingData);
  console.log("DETAIL_DB_LISTING_RAW", JSON.stringify(listing.toObject ? listing.toObject() : listingData, null, 2));
  console.log("PRE_RESPONSE_OBJECT", {
    images: listingData.images,
    gallery: listingData.gallery,
    photos: listingData.photos,
    image: listingData.image,
    coverImage: listingData.coverImage,
    mainImage: listingData.mainImage
  });

  const responseListing = {
    ...listingData,
    seller: listingData.seller || listingData.user || {},
    user: listingData.user || listingData.seller || {}
  };
  console.log("LISTING_ROUTE_MIDDLEWARE_STAGE", "response_listing_built");
  console.log("FINAL_RESPONSE_OBJECT", responseListing);

  console.log("DETAIL_ROUTE_RESULT", {
    id: responseListing._id,
    images: responseListing.images,
    photos: responseListing.photos,
    gallery: responseListing.gallery,
    image: responseListing.image,
    coverImage: responseListing.coverImage,
    mainImage: responseListing.mainImage
  });

  console.log("FINAL_ROUTE_RESPONSE", {
    id: responseListing._id,
    images: responseListing.images,
    photos: responseListing.photos,
    gallery: responseListing.gallery,
    image: responseListing.image,
    coverImage: responseListing.coverImage,
    mainImage: responseListing.mainImage
  });

  console.log("LIVE_DETAIL_RESPONSE", JSON.stringify({
    id: responseListing._id,
    images: responseListing.images,
    photos: responseListing.photos,
    gallery: responseListing.gallery,
    image: responseListing.image,
    coverImage: responseListing.coverImage,
    mainImage: responseListing.mainImage
  }, null, 2));

  console.log("FINAL_ROUTE_RESPONSE_KEYS", Object.keys(responseListing));
  console.log("FINAL_RESPONSE_MEDIA", {
    images: responseListing.images,
    gallery: responseListing.gallery,
    photos: responseListing.photos,
    image: responseListing.image,
    coverImage: responseListing.coverImage,
    mainImage: responseListing.mainImage
  });
  console.log("LISTING_ROUTE_MIDDLEWARE_STAGE", "before_res_json");
  console.log("DETAIL_FETCH_ROUTE_OK", {
    id: String(responseListing._id || responseListing.id || ""),
    publicVisible: isPubliclyVisible
  });

  res.json(responseListing);
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

router.use((err, req, res, next) => {
  if (!err) return next();
  console.error("UPLOAD_FATAL", err);
  if (res.headersSent) return next(err);
  return res.status(500).json({
    success: false,
    error: String(err?.message || err)
  });
});

module.exports = router;






