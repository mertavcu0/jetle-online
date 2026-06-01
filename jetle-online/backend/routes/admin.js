const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const AdminLog = require("../models/AdminLog");
const CarBrand = require("../models/CarBrand");
const Message = require("../models/Message");
const Payment = require("../models/Payment");
const Report = require("../models/Report");
const Activity = require("../models/Activity");
const QUERY_TIMEOUT_MS = Number(process.env.ADMIN_QUERY_TIMEOUT_MS || 4000);
router.use(authMiddleware, authAdmin);

router.param("id", (req, res, next, value) => {
  if (!mongoose.Types.ObjectId.isValid(String(value || ""))) {
    return res.status(400).json({ error: "invalid_id" });
  }
  next();
});

function emptyList() {
  return [];
}

function emptyStats() {
  return {
    total: 0,
    active: 0,
    featured: 0,
    today: 0,
    totalUsers: 0,
    totalMessages: 0,
    onlineUsers: 0,
    activeSockets: 0,
    suspiciousListings: 0,
    totalListings: 0,
    activeListings: 0,
    featuredListings: 0,
    todayListings: 0,
    pendingListings: 0,
    topCategory: "-",
    topCity: "-",
    weeklyGrowth: 0
  };
}

function normalizeStatLabel(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
}

function emptyAnalytics() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
      count: 0
    };
  });

  return {
    dailyListings: days,
    dailyViews: days.map((day) => ({ ...day }))
  };
}

function normalizeCarModel(model) {
  if (typeof model === "string") {
    return {
      name: model,
      fuel: [],
      transmission: [],
      body: [],
      engineVolume: [],
      enginePower: [],
      engine: "",
      hp: ""
    };
  }

  return {
    name: model.name,
    fuel: asArray(model.fuel),
    transmission: asArray(model.transmission),
    body: asArray(model.body),
    engineVolume: asArray(model.engineVolume || model.engine),
    enginePower: asArray(model.enginePower || model.hp),
    engine: model.engine || firstValue(model.engineVolume),
    hp: model.hp || firstValue(model.enginePower)
  };
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function firstValue(value, fallback = "") {
  const items = asArray(value).filter(Boolean);
  return items[0] || fallback;
}

function normalizeAdminUser(user, fallbackEmail = "") {
  return {
    id: String(user?._id || ""),
    name: String(user?.name || user?.email || fallbackEmail || "Kullanıcı"),
    email: String(user?.email || fallbackEmail || "")
  };
}

function normalizeCarSeries(series = []) {
  return series.map((item) => ({
    name: item.name,
    models: (item.models || []).map(normalizeCarModel)
  }));
}

function logAdminStart(path) {
  return path;
}

function logAdminEnd(path) {
  return path;
}

async function findListingOr404(id, res) {
  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404).json({ error: "İlan bulunamadı" });
    return null;
  }
  return listing;
}

async function approveListing(req, res) {
  try {
    console.log("ADMIN_APPROVE_ACTION", JSON.stringify({
      listingId: String(req.params.id || ""),
      adminId: String(req.user?._id || req.user?.id || "")
    }, null, 2));
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { approved: true, status: "approved", isActive: true },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await Notification.create({
      message: "İlan onaylandı",
      type: "admin"
    });

    console.log("MODERATION_APPROVED", JSON.stringify({
      id: String(listing._id || ""),
      approved: listing.approved,
      status: listing.status,
      isActive: listing.isActive
    }, null, 2));

    console.log("MODERATION_PUBLIC_VISIBLE", JSON.stringify({
      id: String(listing._id || ""),
      publicVisible: Boolean(
        listing.approved === true &&
        ["approved", "active"].includes(String(listing.status || "").trim().toLowerCase()) &&
        listing.isActive === true
      )
    }, null, 2));

    await logAdminAction(req, "approve", listing._id, { listingId: listing._id });

    return res.json({ success: true, listing });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    return res.status(500).json({ error: "İlan onaylanamadı" });
  }
}

async function rejectListing(req, res) {
  try {
    console.log("ADMIN_REJECT_ACTION", JSON.stringify({
      listingId: String(req.params.id || ""),
      adminId: String(req.user?._id || req.user?.id || "")
    }, null, 2));
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { approved: false, status: "rejected", isActive: false },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await Notification.create({
      message: "İlan reddedildi",
      type: "admin"
    });

    await logAdminAction(req, "reject", listing._id, { listingId: listing._id });

    return res.json({ success: true, listing });
  } catch (err) {
    console.error("REJECT ERROR:", err);
    return res.status(500).json({ error: "İlan reddedilemedi" });
  }
}

async function featureListing(req, res) {
  try {
    const listing = await findListingOr404(req.params.id, res);
    if (!listing) return;

    listing.isFeatured = !listing.isFeatured;
    if (listing.isFeatured) {
      listing.isShowcase = false;
    }
    listing.featuredUntil = listing.isFeatured
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      : null;

    await listing.save();

    console.log("ADMIN_SET_FEATURED", JSON.stringify({
      listingId: String(listing._id || ""),
      isFeatured: listing.isFeatured,
      isShowcase: listing.isShowcase,
      approved: listing.approved,
      status: listing.status,
      isActive: listing.isActive
    }, null, 2));

    await Notification.create({
      message: listing.isFeatured ? "İlan öne çıkarıldı" : "İlan öne çıkarma alanından kaldırıldı",
      type: "feature"
    });

    await logAdminAction(req, "feature", listing._id, { listingId: listing._id });

    return res.json({ success: true, listing });
  } catch (err) {
    console.error("FEATURE ERROR:", err);
    return res.status(500).json({ error: "Feature başarısız" });
  }
}

async function showcaseListing(req, res) {
  try {
    const listing = await findListingOr404(req.params.id, res);
    if (!listing) return;

    listing.isShowcase = !listing.isShowcase;
    if (listing.isShowcase) {
      listing.isFeatured = false;
      listing.featuredUntil = null;
    }
    await listing.save();

    console.log("ADMIN_SET_SHOWCASE", JSON.stringify({
      listingId: String(listing._id || ""),
      isShowcase: listing.isShowcase,
      isFeatured: listing.isFeatured,
      approved: listing.approved,
      status: listing.status,
      isActive: listing.isActive
    }, null, 2));

    await Notification.create({
      message: listing.isShowcase ? "İlan vitrine alındı" : "İlan vitrinden çıkarıldı",
      type: "showcase"
    });

    await logAdminAction(req, "showcase", listing._id, { listingId: listing._id });

    return res.json({ success: true, listing });
  } catch (err) {
    console.error("SHOWCASE ERROR:", err);
    return res.status(500).json({ error: "Vitrin işlemi başarısız" });
  }
}

async function republishListing(req, res) {
  try {
    const listing = await findListingOr404(req.params.id, res);
    if (!listing) return;

    listing.isDeleted = false;
    listing.isActive = true;
    listing.approved = true;
    listing.status = "active";
    listing.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await listing.save();

    await Notification.create({
      message: "İlan yeniden yayına alındı",
      type: "admin"
    });

    await logAdminAction(req, "republish", listing._id, { listingId: listing._id });

    return res.json({ success: true, listing });
  } catch (err) {
    console.error("REPUBLISH ERROR:", err);
    return res.status(500).json({ error: "İlan yeniden yayınlanamadı" });
  }
}

async function softDeleteListing(req, res) {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isActive: false },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await logAdminAction(req, "delete", listing._id, { listingId: listing._id });

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE LISTING ERROR:", err);
    return res.status(500).json({ error: "İlan silinemedi" });
  }
}

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout`)), QUERY_TIMEOUT_MS)
    )
  ]);
}

async function logAdminAction(req, action, targetId, extra = {}) {
  try {
    await AdminLog.create({
      adminId: req.user?._id,
      action,
      targetId: String(targetId || ""),
      ...extra
    });
  } catch (err) {
    console.error("ADMIN ACTION LOG ERROR:", err);
  }
}

router.get("/listings", async (req, res) => {
  const path = "/api/admin/listings";
  logAdminStart(path);
  try {
    const status = String(req.query.status || "").trim().toLowerCase();
    const search = String(req.query.search || "").trim();
    const city = String(req.query.city || "").trim();
    const category = String(req.query.category || "").trim();
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const query = { isDeleted: false };

    if (status) {
      if (status === "approved") {
        query.$or = [
          { status: "approved" },
          { status: "active" }
        ];
      } else {
        query.status = status;
      }
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { desc: regex },
        { listingNo: regex }
      ];
    }

    if (city) {
      query.city = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }

    if (category) {
      query.category = new RegExp("^" + category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
    }

    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
      query.price = {};
      if (!Number.isNaN(minPrice)) query.price.$gte = minPrice;
      if (!Number.isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    const listings = await withTimeout(
      Listing.find(query).sort({ createdAt: -1 }).populate("user", "name email role").maxTimeMS(QUERY_TIMEOUT_MS),
      path
    );
    if (status === "pending") {
      console.log("ADMIN_PENDING_COUNT", Array.isArray(listings) ? listings.length : 0);
      console.log("MODERATION_PENDING_VISIBLE", JSON.stringify({
        count: Array.isArray(listings) ? listings.length : 0,
        ids: Array.isArray(listings) ? listings.map((item) => String(item?._id || "")).filter(Boolean) : []
      }, null, 2));
    }
    res.json(listings);
  } catch (err) {
    console.error("ADMIN LISTINGS ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.get("/users", async (req, res) => {
  const path = "/api/admin/users";
  logAdminStart(path);
  try {
    const users = await withTimeout(
      User.find().sort({ createdAt: -1 }).maxTimeMS(QUERY_TIMEOUT_MS),
      path
    );
    res.json(users);
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const listings = await Listing.find({ user: user._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .select("title listingNo city category mainCategory subCategory price status approved isActive createdAt")
      .lean();
    const totalListings = listings.length;
    const activeListings = listings.filter((item) => {
      const normalizedStatus = String(item?.status || "").trim().toLowerCase();
      return Boolean(
        item?.approved === true &&
        item?.isActive === true &&
        ["approved", "active"].includes(normalizedStatus)
      );
    }).length;
    const favoriteCount = await Listing.countDocuments({
      favorites: user._id,
      isDeleted: false
    });

    res.json({
      user,
      totalListings,
      activeListings,
      favoriteCount,
      banned: Boolean(user.banned),
      createdAt: user.createdAt,
      listings
    });
  } catch (err) {
    console.error("ADMIN USER DETAIL ERROR:", err);
    res.status(500).json({ error: "Kullanıcı bilgileri alınamadı" });
  }
});

router.get("/suspicious", async (req, res) => {
  try {
    const listings = await Listing.find({ isSuspicious: true, isDeleted: false });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Şüpheli ilanlar alınamadı" });
  }
});

router.get("/stats", async (req, res) => {
  const path = "/api/admin/stats";
  logAdminStart(path);
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const runtimeMetrics = typeof req.app.get("runtimeMetrics") === "function"
      ? req.app.get("runtimeMetrics")()
      : { onlineUsers: 0, activeSockets: 0 };

    const [
      totalUsers,
      totalListings,
      activeListings,
      featuredListings,
      totalMessages,
      suspiciousListings,
      todayListings,
      pendingListings,
      listingsSnapshot
    ] = await withTimeout(
      Promise.all([
        User.countDocuments({ banned: { $ne: true } }).maxTimeMS(QUERY_TIMEOUT_MS),
        Listing.countDocuments({ isDeleted: false }).maxTimeMS(QUERY_TIMEOUT_MS),
        Listing.countDocuments({ isActive: true, isDeleted: false }).maxTimeMS(QUERY_TIMEOUT_MS),
        Listing.countDocuments({ isFeatured: true, isDeleted: false }).maxTimeMS(QUERY_TIMEOUT_MS),
        Message.countDocuments({ isDeleted: { $ne: true } }).maxTimeMS(QUERY_TIMEOUT_MS),
        Listing.countDocuments({ isDeleted: false, isSuspicious: true }).maxTimeMS(QUERY_TIMEOUT_MS),
        Listing.countDocuments({
          isDeleted: false,
          createdAt: mongoose.trusted({ $gte: today })
        }).maxTimeMS(QUERY_TIMEOUT_MS),
        Listing.countDocuments({
          isDeleted: false,
          status: "pending"
        }).maxTimeMS(QUERY_TIMEOUT_MS),
        Listing.find({ isDeleted: false })
          .select("createdAt city mainCategory category subCategory")
          .lean()
          .maxTimeMS(QUERY_TIMEOUT_MS)
      ]),
      path
    );

    const safeListings = Array.isArray(listingsSnapshot) ? listingsSnapshot : [];
    const categoryMap = new Map();
    const cityMap = new Map();
    const nowMs = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    let currentWeek = 0;
    let previousWeek = 0;

    safeListings.forEach((item) => {
      const categoryLabel = String(item?.mainCategory || item?.category || item?.subCategory || "").trim();
      const cityLabel = String(item?.city || "").trim();

      if (categoryLabel) {
        const key = normalizeStatLabel(categoryLabel);
        const current = categoryMap.get(key) || { label: categoryLabel, count: 0 };
        current.count += 1;
        if (!current.label || current.label.length < categoryLabel.length) {
          current.label = categoryLabel;
        }
        categoryMap.set(key, current);
      }

      if (cityLabel) {
        const key = normalizeStatLabel(cityLabel);
        const current = cityMap.get(key) || { label: cityLabel, count: 0 };
        current.count += 1;
        if (!current.label || current.label.length < cityLabel.length) {
          current.label = cityLabel;
        }
        cityMap.set(key, current);
      }

      const createdAtMs = item?.createdAt ? new Date(item.createdAt).getTime() : 0;
      if (!createdAtMs || Number.isNaN(createdAtMs)) return;
      const ageMs = nowMs - createdAtMs;
      if (ageMs <= oneWeekMs) {
        currentWeek += 1;
      } else if (ageMs <= oneWeekMs * 2) {
        previousWeek += 1;
      }
    });

    const topCategory = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count)[0]?.label || "-";
    const topCity = Array.from(cityMap.values()).sort((a, b) => b.count - a.count)[0]?.label || "-";
    const weeklyGrowth = previousWeek > 0
      ? Math.round(((currentWeek - previousWeek) / previousWeek) * 100)
      : (currentWeek > 0 ? 100 : 0);

    res.json({
      total: totalListings,
      active: activeListings,
      featured: featuredListings,
      today: todayListings,
      totalUsers,
      totalMessages,
      onlineUsers: runtimeMetrics.onlineUsers || 0,
      activeSockets: runtimeMetrics.activeSockets || 0,
      suspiciousListings,
      totalListings,
      activeListings,
      featuredListings,
      todayListings,
      pendingListings,
      topCategory,
      topCity,
      weeklyGrowth
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(200).json(emptyStats());
  } finally {
    logAdminEnd(path);
  }
});

router.get("/analytics", async (req, res) => {
  const path = "/api/admin/analytics";
  logAdminStart(path);
  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const listings = await withTimeout(
      Listing.find({
        isDeleted: false,
        createdAt: mongoose.trusted({ $gte: start })
      }).select("createdAt views").maxTimeMS(QUERY_TIMEOUT_MS),
      path
    );

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = date.toISOString().slice(0, 10);

      return {
        date: key,
        label: date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
        count: 0,
        views: 0
      };
    });

    const byDate = new Map(days.map((day) => [day.date, day]));

    listings.forEach((listing) => {
      const key = new Date(listing.createdAt).toISOString().slice(0, 10);
      const day = byDate.get(key);

      if (day) {
        day.count += 1;
        day.views += listing.views || 0;
      }
    });

    res.json({
      dailyListings: days.map((day) => ({
        date: day.date,
        label: day.label,
        count: day.count
      })),
      dailyViews: days.map((day) => ({
        date: day.date,
        label: day.label,
        count: day.views
      }))
    });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(200).json(emptyAnalytics());
  } finally {
    logAdminEnd(path);
  }
});

router.get("/messages", async (req, res) => {
  const path = "/api/admin/messages";
  logAdminStart(path);
  try {
    const messages = await withTimeout(
      Message.find({ isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(250)
        .populate("senderId", "_id name email")
        .populate("receiverId", "_id name email")
        .populate("listingId", "_id title price city")
        .maxTimeMS(QUERY_TIMEOUT_MS)
        .lean(),
      path
    );

    const conversations = [];
    const seen = new Set();

    for (const message of Array.isArray(messages) ? messages : []) {
      const listingId = String(message?.listingId?._id || message?.listingId || "");
      const senderId = String(message?.senderId?._id || message?.senderId || "");
      const receiverId = String(message?.receiverId?._id || message?.receiverId || "");
      const conversationId = String(message?.conversationId || "").trim();
      const fallbackKey = [listingId, senderId, receiverId].filter(Boolean).sort().join("__");
      const key = conversationId || fallbackKey;

      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      const sender = normalizeAdminUser(message?.senderId, message?.senderEmail);
      const receiver = normalizeAdminUser(message?.receiverId, message?.receiverEmail);
      const listing = message?.listingId && typeof message.listingId === "object"
        ? {
            id: String(message.listingId._id || ""),
            title: String(message.listingId.title || "Ilan"),
            price: Number(message.listingId.price || 0),
            city: String(message.listingId.city || "")
          }
        : null;

      conversations.push({
        id: key,
        conversationId: conversationId || key,
        listingId,
        listing,
        listingUrl: listingId ? `/listing-detail.html?id=${listingId}` : "",
        users: [sender, receiver],
        sender,
        receiver,
        lastMessage: {
          id: String(message?._id || ""),
          text: String(message?.text || ""),
          createdAt: message?.createdAt || null
        },
        updatedAt: message?.updatedAt || message?.createdAt || null
      });
    }

    res.json(conversations);
  } catch (err) {
    console.error("ADMIN MESSAGES ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.get("/cars", async (req, res) => {
  const path = "/api/admin/cars";
  logAdminStart(path);
  try {
    const brands = await withTimeout(
      CarBrand.find().sort({ name: 1 }).maxTimeMS(QUERY_TIMEOUT_MS),
      path
    );
    res.json(brands);
  } catch (err) {
    console.error("ADMIN CARS ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.post("/car-brand", async (req, res) => {
  try {
    const { name, series } = req.body;
    if (!name) return res.status(400).json({ error: "Marka adı zorunlu" });

    const brand = await CarBrand.findOneAndUpdate(
      { name },
      { $setOnInsert: { name, series: Array.isArray(series) ? normalizeCarSeries(series) : [] } },
      { new: true, upsert: true }
    );

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR BRAND ERROR:", err);
    res.status(500).json({ error: "Marka eklenemedi" });
  }
});

router.post("/car-series", async (req, res) => {
  try {
    const brandName = req.body.brandName || req.body.brand;
    const seriesName = req.body.seriesName || req.body.name;
    if (!brandName || !seriesName) {
      return res.status(400).json({ error: "Marka ve seri zorunlu" });
    }

    const brand = await CarBrand.findOneAndUpdate(
      { name: brandName },
      { $setOnInsert: { name: brandName, series: [] } },
      { new: true, upsert: true }
    );

    const exists = brand.series.some((item) => item.name === seriesName);
    if (!exists) {
      brand.series.push({ name: seriesName, models: [] });
      await brand.save();
    }

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR SERIES ERROR:", err);
    res.status(500).json({ error: "Seri eklenemedi" });
  }
});

router.post("/car-model", async (req, res) => {
  try {
    const brandId = req.body.brandId || req.body.brandID || "";
    const seriesId = req.body.seriesId || req.body.seriesID || "";
    const brandName = req.body.brandName || req.body.brand || "";
    const seriesName = req.body.seriesName || req.body.series || "";
    const modelName = req.body.modelName || req.body.model || req.body.name || "Model";

    let brand = brandId
      ? await CarBrand.findById(brandId)
      : await CarBrand.findOne({ name: brandName });

    if (!brand) {
      brand = await CarBrand.create({
        name: brandName || "Marka",
        series: []
      });
    }

    let series = seriesId
      ? brand.series.id?.(seriesId)
      : brand.series.find((item) => item.name === seriesName);

    if (!series) {
      brand.series.push({ name: seriesName || "Seri", models: [] });
      series = brand.series[brand.series.length - 1];
    }

    const exists = series.models.some((model) => model.name === modelName);
    if (!exists) {
      const engineVolume = asArray(req.body.engineVolume || req.body.engine);
      const enginePower = asArray(req.body.enginePower || req.body.hp);

      series.models.push({
        name: modelName,
        fuel: asArray(req.body.fuel),
        transmission: asArray(req.body.transmission),
        body: asArray(req.body.body),
        engineVolume,
        enginePower,
        engine: req.body.engine || firstValue(engineVolume),
        hp: req.body.hp || firstValue(enginePower)
      });
      await brand.save();
    }

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR MODEL ERROR:", err);
    res.status(500).json({ error: "Model eklenemedi" });
  }
});

router.patch("/car-brand", async (req, res) => {
  try {
    const oldName = req.body.oldName || req.body.brandName || req.body.brand;
    const name = req.body.name;
    if (!oldName || !name) return res.status(400).json({ error: "Marka adı zorunlu" });

    const brand = await CarBrand.findOneAndUpdate(
      { name: oldName },
      { name },
      { new: true }
    );

    if (!brand) return res.status(404).json({ error: "Marka bulunamadı" });

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR BRAND UPDATE ERROR:", err);
    res.status(500).json({ error: "Marka güncellenemedi" });
  }
});

router.patch("/car-series", async (req, res) => {
  try {
    const brandName = req.body.brandName || req.body.brand;
    const oldName = req.body.oldName || req.body.seriesName || req.body.series;
    const name = req.body.name;
    if (!brandName || !oldName || !name) {
      return res.status(400).json({ error: "Marka ve seri zorunlu" });
    }

    const brand = await CarBrand.findOne({ name: brandName });
    if (!brand) return res.status(404).json({ error: "Marka bulunamadı" });

    const series = brand.series.find((item) => item.name === oldName);
    if (!series) return res.status(404).json({ error: "Seri bulunamadı" });

    series.name = name;
    await brand.save();

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR SERIES UPDATE ERROR:", err);
    res.status(500).json({ error: "Seri güncellenemedi" });
  }
});

router.patch("/car-model", async (req, res) => {
  try {
    const brandName = req.body.brandName || req.body.brand;
    const seriesName = req.body.seriesName || req.body.series;
    const oldName = req.body.oldName || req.body.modelName || req.body.model;
    const name = req.body.name;
    if (!brandName || !seriesName || !oldName || !name) {
      return res.status(400).json({ error: "Marka, seri ve model zorunlu" });
    }

    const brand = await CarBrand.findOne({ name: brandName });
    if (!brand) return res.status(404).json({ error: "Marka bulunamadı" });

    const series = brand.series.find((item) => item.name === seriesName);
    if (!series) return res.status(404).json({ error: "Seri bulunamadı" });

    const model = series.models.find((item) => item.name === oldName);
    if (!model) return res.status(404).json({ error: "Model bulunamadı" });

    model.name = name;
    model.fuel = asArray(req.body.fuel);
    model.transmission = asArray(req.body.transmission);
    model.body = asArray(req.body.body);
    model.engineVolume = asArray(req.body.engineVolume || req.body.engine);
    model.enginePower = asArray(req.body.enginePower || req.body.hp);
    model.engine = req.body.engine || firstValue(model.engineVolume);
    model.hp = req.body.hp || firstValue(model.enginePower);

    await brand.save();

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR MODEL UPDATE ERROR:", err);
    res.status(500).json({ error: "Model güncellenemedi" });
  }
});

router.patch("/listings/:id/feature", featureListing);
router.put("/listings/:id/feature", featureListing);
router.patch("/listings/:id/showcase", showcaseListing);
router.put("/listings/:id/showcase", showcaseListing);

router.patch("/listings/:id/boost", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "İlan yok" });

    listing.isBoosted = true;
    listing.boostUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await listing.save();

    await Notification.create({
      message: "İlan boost yapıldı",
      type: "boost"
    });

    await logAdminAction(req, "boost", listing._id, { listingId: listing._id });

    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ error: "Boost error" });
  }
});

router.patch("/listings/:id/toggle", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    listing.isActive = !listing.isActive;

    await listing.save();

    await logAdminAction(req, listing.isActive ? "activate" : "deactivate", listing._id, {
      listingId: listing._id
    });

    res.json({
      success: true,
      isActive: listing.isActive
    });
  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ error: "Durum değiştirilemedi" });
  }
});

router.patch("/listings/:id/approve", approveListing);
router.put("/listings/:id/approve", approveListing);

router.patch("/listings/:id/reject", rejectListing);
router.put("/listings/:id/reject", rejectListing);

router.patch("/listings/:id/edit", async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "price",
      "description",
      "desc",
      "city",
      "district",
      "category",
      "brand",
      "model",
      "year",
      "km",
      "fuel",
      "transmission",
      "bodyType",
      "color",
      "engine",
      "power",
      "isActive",
      "status"
    ];

    const update = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        update[field] = req.body[field];
      }
    });

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await logAdminAction(req, "edit", listing._id, { listingId: listing._id });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("ADMIN LISTING EDIT ERROR:", err);
    res.status(500).json({ error: "İlan güncellenemedi" });
  }
});

router.patch("/users/:id/ban", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ error: "admin_user_protected" });
    }

    user.banned = !Boolean(user.banned);
    await user.save();

    await Notification.create({
      message: user.banned ? "Kullanıcı banlandı" : "Kullanıcı banı kaldırıldı",
      type: "user"
    });

    await logAdminAction(req, user.banned ? "ban" : "unban", user._id, { userId: user._id });

    res.json({ success: true, banned: user.banned });
  } catch (err) {
    console.error("BAN USER ERROR:", err);
    res.status(500).json({ error: "Kullanıcı işlemi başarısız" });
  }
});

router.delete("/listings/:id", softDeleteListing);
router.delete("/delete/:id", softDeleteListing);

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ error: "admin_user_protected" });
    }

    await User.findByIdAndDelete(req.params.id);
    await logAdminAction(req, "delete_user", req.params.id, { userId: req.params.id });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ error: "Kullanıcı silinemedi" });
  }
});

router.patch("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false });
  }

  if (typeof req.body.isSuspicious === "boolean") {
    listing.isSuspicious = req.body.isSuspicious;
  } else {
    listing.isActive = !listing.isActive;
  }

  await listing.save();
  await logAdminAction(req, listing.isSuspicious ? "mark_suspicious" : "toggle_listing", listing._id, {
    listingId: listing._id
  });
  res.json({ success: true, isActive: listing.isActive, isSuspicious: listing.isSuspicious });
});

router.put("/listings/:id/republish", republishListing);
router.patch("/listings/:id/republish", republishListing);

router.get("/reports", async (req, res) => {
  const path = "/api/admin/reports";
  logAdminStart(path);
  try {
    const reports = await withTimeout(
      Report.find()
        .sort({ createdAt: -1 })
        .limit(200)
        .populate("listingId", "title")
        .populate("listing", "title")
        .populate("userId", "name email")
        .populate("user", "name email")
        .lean(),
      path
    );
    res.json(Array.isArray(reports) ? reports : emptyList());
  } catch (err) {
    console.error("ADMIN REPORTS ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.get("/payments", async (req, res) => {
  const path = "/api/admin/payments";
  logAdminStart(path);
  try {
    const payments = await withTimeout(
      Payment.find()
        .sort({ createdAt: -1 })
        .limit(200)
        .populate("listingId", "title")
        .populate("userId", "name email")
        .lean(),
      path
    );
    res.json(Array.isArray(payments) ? payments : emptyList());
  } catch (err) {
    console.error("ADMIN PAYMENTS ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.get("/activities", async (req, res) => {
  const path = "/api/admin/activities";
  logAdminStart(path);
  try {
    const activities = await withTimeout(
      Activity.find()
        .sort({ createdAt: -1 })
        .limit(250)
        .populate("userId", "name email")
        .lean(),
      path
    );
    res.json(Array.isArray(activities) ? activities : emptyList());
  } catch (err) {
    console.error("ADMIN ACTIVITIES ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.post("/user/:id/badge", async (req, res) => {
  try {
    const badge = String(req.body?.badge || "").trim();
    if (!badge) {
      return res.status(400).json({ error: "badge_required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const currentBadges = Array.isArray(user.badges) ? user.badges : [];
    if (!currentBadges.includes(badge)) {
      currentBadges.push(badge);
    }
    user.badges = currentBadges;
    if (badge === "verified") {
      user.verifiedBadge = true;
    }
    await user.save();
    await logAdminAction(req, "add_badge", req.params.id, { userId: req.params.id, badge });
    res.json({ success: true, user });
  } catch (err) {
    console.error("ADMIN BADGE ADD ERROR:", err);
    res.status(500).json({ error: "Rozet eklenemedi" });
  }
});

router.delete("/user/:id/badge", async (req, res) => {
  try {
    const badge = String(req.body?.badge || "").trim();
    if (!badge) {
      return res.status(400).json({ error: "badge_required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    user.badges = (Array.isArray(user.badges) ? user.badges : []).filter((item) => item !== badge);
    if (badge === "verified") {
      user.verifiedBadge = false;
    }
    await user.save();
    await logAdminAction(req, "remove_badge", req.params.id, { userId: req.params.id, badge });
    res.json({ success: true, user });
  } catch (err) {
    console.error("ADMIN BADGE REMOVE ERROR:", err);
    res.status(500).json({ error: "Rozet kaldırılamadı" });
  }
});

// ADMIN NOTIFICATIONS
router.get("/notifications", async (req, res) => {
  const path = "/api/admin/notifications";
  logAdminStart(path);
  try {
    const [totalCount, unreadCount, data] = await Promise.all([
      withTimeout(Notification.countDocuments({}), `${path}:total`),
      withTimeout(Notification.countDocuments({ isRead: { $ne: true } }), `${path}:unread`),
      withTimeout(
        Notification.find()
          .sort({ isRead: 1, createdAt: -1 })
          .limit(50)
          .lean()
          .maxTimeMS(QUERY_TIMEOUT_MS),
        path
      )
    ]);

    res.setHeader("X-Notification-Total-Count", String(totalCount || 0));
    res.setHeader("X-Notification-Unread-Count", String(unreadCount || 0));

    res.json(data);
  } catch (err) {
    console.error("NOTIFICATION ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
  }
});

router.put("/notifications/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Bildirim bulunamadı" });
    }
    res.json({ success: true, notification });
  } catch (err) {
    console.error("NOTIFICATION READ ERROR:", err);
    res.status(500).json({ error: "Bildirim güncellenemedi" });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("adminId", "name email role")
      .populate("listingId", "title")
      .populate("userId", "name email");

    res.json(logs);
  } catch (err) {
    console.error("ADMIN LOG ERROR:", err);
    res.status(500).json({ error: "Loglar alınamadı" });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const oldPassword = String(req.body?.oldPassword || "");
    const newPassword = String(req.body?.newPassword || "");

    if (!oldPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "invalid_password_request" });
    }

    const user = await User.findById(req.user?._id);
    if (!user || !user.password) {
      return res.status(404).json({ error: "admin_not_found" });
    }

    const ok = await bcrypt.compare(oldPassword, String(user.password || ""));
    if (!ok) {
      return res.status(400).json({ error: "old_password_invalid" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await logAdminAction(req, "change_password", req.user?._id, { userId: req.user?._id });

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ error: "password_change_failed" });
  }
});

module.exports = router;

