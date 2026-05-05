const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

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

router.post(
  "/upload",
  function (req, res, next) {
    upload.array("images", 10)(req, res, function (err) {
      if (err) return res.status(400).json({ msg: err.message || "upload hatası" });
      next();
    });
  },
  function (req, res) {
    const urls = (req.files || []).map(function (f) {
      return "/uploads/" + f.filename;
    });
    res.json({ urls });
  }
);

router.post("/", upload.array("images", 20), async (req, res) => {
  try {
    console.log("BODY SIZE:", JSON.stringify(req.body).length);
    const imageUrls = (req.files || []).map((file) => "/uploads/" + file.filename);

    const userEmail = req.body.userEmail;
    const title = String(req.body.title || "");
    const description = String(req.body.description || req.body.desc || "");
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
      images
    } = req.body;
    const listingImages = imageUrls.length ? imageUrls : images;

    const user = await User.findOne({ email: userEmail });

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
      images: listingImages,
      listingNo: req.body.listingNo || await generateUniqueListingNo(),
      status: "pending",
      isFeatured: false,
    });

    if (title.length < 3 || description.length < 10) {
      listing.isSuspicious = true;
    }

    if (user) {
      listing.user = user._id;
    } else {
      console.log("USER NOT FOUND FOR LISTING:", userEmail);
    }

    await listing.save();
    await Notification.create({
      message: "Yeni ilan eklendi",
      type: "listing"
    });

    res.json({ success: true, listing });
  } catch (err) {
    console.error("LISTING CREATE ERROR:", err);
    res.status(500).json({ error: "server error" });
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
      const listings = await Listing.find(query)
        .sort({ views: -1 })
        .limit(10)
        .populate("user", "name email")
        .populate("favorites", "email");

      return res.json(listings);
    }

    const listings = await Listing.find(query)
      .populate("user", "name email")
      .populate("favorites", "email");

    listings.forEach(l => {
      l.score =
        (l.isFeatured ? 120 : 0) +
        (l.isBoosted ? 60 : 0) +
        ((l.views || 0) * 2) +
        ((Date.now() - new Date(l.createdAt)) < 3 * 86400000 ? 20 : 0);
    });

    listings.sort((a, b) => b.score - a.score);

    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

router.get("/my-listings", async (req, res) => {
  try {
    const email = req.query.email;

    const user = await User.findOne({ email });
    if (!user) return res.json([]);

    const listings = await Listing.find({ user: user._id, isDeleted: false });

    res.json(listings);
  } catch (err) {
    console.error("MY LISTINGS ERROR:", err);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/favorite/:id", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.favorites.includes(req.params.id)) {
    user.favorites.push(req.params.id);
  }

  await user.save();
  res.json({ success: true });
});

router.get("/favorites", async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });
  if (!user) return res.json([]);

  const listings = await Listing.find({
    favorites: user._id,
    isDeleted: false
  }).sort({ createdAt: -1 });

  res.json(listings);
});

router.get("/user/:id", async (req, res) => {
  const listings = await Listing.find({ user: req.params.id, isDeleted: false });
  res.json(listings);
});

router.patch("/:id/favorite", async (req, res) => {
  try {
    const { email, userId } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ email });

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

router.post("/:id/favorite", async (req, res) => {
  try {
    const { email, userId } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ email });

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

router.put("/:id", async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, listing: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
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
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
