const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const AdminLog = require("../models/AdminLog");
const CarBrand = require("../models/CarBrand");
const Message = require("../models/Message");
const QUERY_TIMEOUT_MS = Number(process.env.ADMIN_QUERY_TIMEOUT_MS || 4000);
router.use(authMiddleware, authAdmin);

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
    todayListings: 0
  };
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
    const listings = await withTimeout(
      Listing.find({ isDeleted: false }).sort({ createdAt: -1 }).maxTimeMS(QUERY_TIMEOUT_MS),
      path
    );
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
      return res.status(404).json({ error: "KullanÄ±cÄ± bulunamadÄ±" });
    }

    const totalListings = await Listing.countDocuments({ user: user._id, isDeleted: false });
    const activeListings = await Listing.countDocuments({
      user: user._id,
      isDeleted: false,
      isActive: true
    });
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
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error("ADMIN USER DETAIL ERROR:", err);
    res.status(500).json({ error: "KullanÄ±cÄ± bilgileri alÄ±namadÄ±" });
  }
});

router.get("/suspicious", async (req, res) => {
  try {
    const listings = await Listing.find({ isSuspicious: true, isDeleted: false });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "ÅÃ¼pheli ilanlar alÄ±namadÄ±" });
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
      todayListings
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
          createdAt: { $gte: today }
        }).maxTimeMS(QUERY_TIMEOUT_MS)
      ]),
      path
    );

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
      todayListings
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
        createdAt: { $gte: start }
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
      Message.find().sort({ createdAt: -1 }).limit(100).maxTimeMS(QUERY_TIMEOUT_MS),
      path
    );
    res.json(messages);
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
    if (!name) return res.status(400).json({ error: "Marka adÄ± zorunlu" });

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
    if (!oldName || !name) return res.status(400).json({ error: "Marka adÃ„Â± zorunlu" });

    const brand = await CarBrand.findOneAndUpdate(
      { name: oldName },
      { name },
      { new: true }
    );

    if (!brand) return res.status(404).json({ error: "Marka bulunamadÃ„Â±" });

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR BRAND UPDATE ERROR:", err);
    res.status(500).json({ error: "Marka gÃƒÂ¼ncellenemedi" });
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
    if (!brand) return res.status(404).json({ error: "Marka bulunamadÃ„Â±" });

    const series = brand.series.find((item) => item.name === oldName);
    if (!series) return res.status(404).json({ error: "Seri bulunamadÃ„Â±" });

    series.name = name;
    await brand.save();

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR SERIES UPDATE ERROR:", err);
    res.status(500).json({ error: "Seri gÃƒÂ¼ncellenemedi" });
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
    if (!brand) return res.status(404).json({ error: "Marka bulunamadÃ„Â±" });

    const series = brand.series.find((item) => item.name === seriesName);
    if (!series) return res.status(404).json({ error: "Seri bulunamadÃ„Â±" });

    const model = series.models.find((item) => item.name === oldName);
    if (!model) return res.status(404).json({ error: "Model bulunamadÃ„Â±" });

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
    res.status(500).json({ error: "Model gÃƒÂ¼ncellenemedi" });
  }
});

router.patch("/listings/:id/feature", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "Ä°lan bulunamadÄ±" });
    }

    listing.isFeatured = !listing.isFeatured;
    listing.featuredUntil = listing.isFeatured
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      : null;

    await listing.save();

    await Notification.create({
      message: "Ä°lan vitrine alÄ±ndÄ±",
      type: "feature"
    });

    await logAdminAction(req, "feature", listing._id, { listingId: listing._id });

    res.json({ success: true, listing });

  } catch (err) {
    console.error("FEATURE ERROR:", err);
    res.status(500).json({ error: "Feature baÅŸarÄ±sÄ±z" });
  }
});

router.patch("/listings/:id/boost", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Ä°lan yok" });

    listing.isBoosted = true;
    listing.boostUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await listing.save();

    await Notification.create({
      message: "Ä°lan boost yapÄ±ldÄ±",
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
      return res.status(404).json({ error: "Ä°lan bulunamadÄ±" });
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
    res.status(500).json({ error: "Toggle baÅŸarÄ±sÄ±z" });
  }
});

router.patch("/listings/:id/approve", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await Notification.create({
      message: "Ä°lan onaylandÄ±",
      type: "admin"
    });

    await logAdminAction(req, "approve", listing._id, { listingId: listing._id });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ error: "İlan onaylanamadı" });
  }
});

router.patch("/listings/:id/reject", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await Notification.create({
      message: "Ä°lan reddedildi",
      type: "admin"
    });

    await logAdminAction(req, "reject", listing._id, { listingId: listing._id });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ error: "İlan reddedilemedi" });
  }
});

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
      return res.status(404).json({ error: "Ä°lan bulunamadÄ±" });
    }

    await logAdminAction(req, "edit", listing._id, { listingId: listing._id });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("ADMIN LISTING EDIT ERROR:", err);
    res.status(500).json({ error: "Ä°lan gÃ¼ncellenemedi" });
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

router.delete("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await logAdminAction(req, "delete", listing._id, { listingId: listing._id });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE LISTING ERROR:", err);
    res.status(500).json({ error: "İlan silinemedi" });
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

// ADMIN NOTIFICATIONS
router.get("/notifications", async (req, res) => {
  const path = "/api/admin/notifications";
  logAdminStart(path);
  try {
    const data = await withTimeout(
      Notification.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .maxTimeMS(QUERY_TIMEOUT_MS),
      path
    );

    res.json(data);
  } catch (err) {
    console.error("NOTIFICATION ERROR:", err);
    res.status(200).json(emptyList());
  } finally {
    logAdminEnd(path);
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
    res.status(500).json({ error: "Loglar alÄ±namadÄ±" });
  }
});

module.exports = router;

