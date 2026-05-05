const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function parseJsonObject(value) {
  if (value == null || value === "") return {};
  if (typeof value === "object" && !Buffer.isBuffer(value)) return { ...value };
  try {
    const o = JSON.parse(String(value));
    return o && typeof o === "object" ? o : {};
  } catch (e) {
    return {};
  }
}

function normalizeImagesArray(item) {
  const seen = new Set();
  const out = [];
  const push = (u) => {
    if (u == null) return;
    const t = String(u).trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  if (Array.isArray(item.images)) item.images.forEach(push);
  push(item.image);
  return out;
}

function gatherUploadedImagePaths(req) {
  const out = [];
  const f = req.files;
  if (!f) return out;
  const pushArr = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const file of arr) {
      if (file && file.filename) out.push(`/uploads/${file.filename}`);
    }
  };
  if (Array.isArray(f)) {
    for (const file of f) {
      if (file && file.filename) out.push(`/uploads/${file.filename}`);
    }
    return out;
  }
  pushArr(f.image);
  pushArr(f.images);
  return out;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const uploadListingImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);

// ilan ekleme (multipart + isteğe bağlı JWT; MongoDB kalıcı kayıt)
router.post("/", optionalAuth, uploadListingImages, async (req, res) => {
  try {
    if (!req.body.image || req.body.image.trim() === "") {
      req.body.image = "https://picsum.photos/300/200";
    }

    const { title, description, desc, price, location, city, category } = req.body;
    if (!title || price === undefined || price === null || Number.isNaN(Number(price))) {
      return res.status(400).json({ error: "Eksik alan" });
    }

    const features = parseJsonObject(req.body.features);
    const damageMap =
      Object.keys(parseJsonObject(req.body.damageMap)).length > 0
        ? parseJsonObject(req.body.damageMap)
        : parseJsonObject(req.body.aracParcalari);

    const imagePaths = gatherUploadedImagePaths(req);
    const primaryImage = imagePaths[0] || req.body.image;

    const newListing = new Listing({
      title: String(title).trim(),
      description: description != null ? String(description) : desc != null ? String(desc) : "",
      desc: desc != null ? String(desc) : description != null ? String(description) : "",
      price: Number(price),
      location: location || city || "",
      city: city || location || "",
      category: category || "",
      user: req.user ? req.user.id : null,
      status: "pending",
      image: primaryImage,
      images: imagePaths.length ? imagePaths : [req.body.image],
      features,
      damageMap,
    });

    if (req.user && req.user.id) {
      const userListingCount = await Listing.countDocuments({
        user: req.user.id,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      if (userListingCount >= 10) {
        newListing.isSuspicious = true;
        await User.findByIdAndUpdate(req.user.id, { isSuspicious: true });
      }
    }

    await newListing.save();

    if (req.user && req.user.id) {
      await Activity.create({
        userId: req.user.id,
        action: "create_listing",
        ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""
      });
    }

    await Notification.create({
      type: "new_listing",
      message: `Yeni ilan eklendi: ${newListing.title}`
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("new_listing", {
        listing: newListing,
        message: `Yeni ilan eklendi: ${newListing.title}`
      });
    }

    if (req.user && req.user.id) {
      const count = await Listing.countDocuments({ user: req.user.id });
      if (count >= 5) {
        await User.findByIdAndUpdate(req.user.id, { badge: "trusted" });
      }
    }

    const payload = newListing.toObject();
    payload._id = newListing._id;
    res.status(201).json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// tüm ilanları getir (reddedilmeyenler — sayfa yenilenince kaybolmaz)
router.get("/", async (req, res) => {
  try {
    const { search, category, city, min, max, minPrice, maxPrice } = req.query;
    const minValue = minPrice || min;
    const maxValue = maxPrice || max;

    const query = { status: "approved", isActive: true };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (minValue || maxValue) {
      query.price = {};
      if (minValue) query.price.$gte = Number(minValue);
      if (maxValue) query.price.$lte = Number(maxValue);
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 }).populate("user", "name email badge badges");
    res.json(
      listings.map((doc) => {
        const o = doc.toObject();
        o.images = normalizeImagesArray(o);
        o.desc = o.desc || o.description || "";
        return o;
      })
    );
  } catch (err) {
    res.status(500).json({ error: "Geçersiz ID" });
  }
});

router.get("/my-listings", auth, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const item = await Listing.findById(req.params.id).populate("user", "name badge badges");
    if (!item || item.status !== "approved" || item.isActive === false) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    if (req.user && req.user.id) {
      await Activity.create({
        userId: req.user.id,
        action: "view_listing",
        ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""
      });
    }

    const raw = item.toObject();
    const payload = {
      ...raw,
      city: item.city || item.location || "",
      category: item.category || "",
      desc: item.desc || item.description || "",
      images: normalizeImagesArray(raw),
      damageMap: item.damageMap || {},
      features: item.features || {},
    };

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: "Geçersiz ID" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "İlan bulunamadı" });
    }

    if (!listing.user || String(listing.user) !== String(req.user.id)) {
      return res.status(403).json({ error: "Yetkisiz" });
    }

    await listing.deleteOne();
    res.json({ message: "İlan silindi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
