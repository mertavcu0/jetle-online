const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const AdminLog = require("../models/AdminLog");
const CarBrand = require("../models/CarBrand");

function normalizeCarModel(model) {
  if (typeof model === "string") {
    return {
      name: model,
      fuel: [],
      transmission: [],
      body: [],
      engine: "",
      hp: ""
    };
  }

  return {
    name: model.name,
    fuel: asArray(model.fuel),
    transmission: asArray(model.transmission),
    body: asArray(model.body),
    engine: model.engine || "",
    hp: model.hp || ""
  };
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeCarSeries(series = []) {
  return series.map((item) => ({
    name: item.name,
    models: (item.models || []).map(normalizeCarModel)
  }));
}

console.log("ADMIN.JS YÜKLENDİ");

router.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Listings alınamadı" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Users alınamadı" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
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
  try {
    const totalListings = await Listing.countDocuments({ isDeleted: false });
    const activeListings = await Listing.countDocuments({ isActive: true, isDeleted: false });
    const featuredListings = await Listing.countDocuments({ isFeatured: true, isDeleted: false });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayListings = await Listing.countDocuments({
      isDeleted: false,
      createdAt: { $gte: today }
    });

    res.json({
      totalListings,
      activeListings,
      featuredListings,
      todayListings
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: "Stats alınamadı" });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const listings = await Listing.find({
      isDeleted: false,
      createdAt: { $gte: start }
    }).select("createdAt views");

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
    res.status(500).json({ error: "Analytics alınamadı" });
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
    const brandName = req.body.brandName || req.body.brand;
    const seriesName = req.body.seriesName || req.body.series;
    const modelName = req.body.modelName || req.body.model || req.body.name;
    if (!brandName || !seriesName || !modelName) {
      return res.status(400).json({ error: "Marka, seri ve model zorunlu" });
    }

    const brand = await CarBrand.findOneAndUpdate(
      { name: brandName },
      { $setOnInsert: { name: brandName, series: [] } },
      { new: true, upsert: true }
    );

    let series = brand.series.find((item) => item.name === seriesName);
    if (!series) {
      brand.series.push({ name: seriesName, models: [] });
      series = brand.series[brand.series.length - 1];
    }

    const exists = series.models.some((model) => model.name === modelName);
    if (!exists) {
      series.models.push({
        name: modelName,
        fuel: asArray(req.body.fuel),
        transmission: asArray(req.body.transmission),
        body: asArray(req.body.body),
        engine: req.body.engine || "",
        hp: req.body.hp || ""
      });
      await brand.save();
    }

    res.json({ success: true, brand });
  } catch (err) {
    console.error("CAR MODEL ERROR:", err);
    res.status(500).json({ error: "Model eklenemedi" });
  }
});

router.patch("/listings/:id/feature", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    listing.isFeatured = !listing.isFeatured;
    listing.featuredUntil = listing.isFeatured
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      : null;

    await listing.save();

    await Notification.create({
      message: "İlan vitrine alındı",
      type: "feature"
    });

    await AdminLog.create({
      action: "feature",
      listingId: listing._id
    });

    res.json({ success: true, listing });

  } catch (err) {
    console.error("FEATURE ERROR:", err);
    res.status(500).json({ error: "Feature başarısız" });
  }
});

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

    await AdminLog.create({
      action: "boost",
      listingId: listing._id
    });

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

    res.json({
      success: true,
      isActive: listing.isActive
    });
  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ error: "Toggle başarısız" });
  }
});

router.patch("/listings/:id/approve", async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  await Notification.create({
    message: "İlan onaylandı",
    type: "admin"
  });

  await AdminLog.create({
    action: "approve",
    listingId: listing?._id || req.params.id
  });

  res.json({ success: true, listing });
});

router.patch("/listings/:id/reject", async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  await Notification.create({
    message: "İlan reddedildi",
    type: "admin"
  });

  await AdminLog.create({
    action: "reject",
    listingId: listing?._id || req.params.id
  });

  res.json({ success: true, listing });
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
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    await AdminLog.create({
      action: "edit",
      listingId: listing._id
    });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("ADMIN LISTING EDIT ERROR:", err);
    res.status(500).json({ error: "İlan güncellenemedi" });
  }
});

router.patch("/users/:id/ban", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { banned: true });
  await Notification.create({
    message: "Kullanıcı banlandı",
    type: "user"
  });

  await AdminLog.create({
    action: "ban",
    userId: req.params.id
  });

  res.json({ success: true });
});

router.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ success: true });
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
  res.json({ success: true, isActive: listing.isActive, isSuspicious: listing.isSuspicious });
});

// ADMIN NOTIFICATIONS
router.get("/notifications", async (req, res) => {
  try {
    const data = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(data);
  } catch (err) {
    console.error("NOTIFICATION ERROR:", err);
    res.status(500).json({ error: "notification error" });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("listingId", "title")
      .populate("userId", "name email");

    res.json(logs);
  } catch (err) {
    console.error("ADMIN LOG ERROR:", err);
    res.status(500).json({ error: "Loglar alınamadı" });
  }
});

module.exports = router;
