const express = require("express");
const mongoose = require("mongoose");
const Ad = require("../models/Ad");
const authMiddleware = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const router = express.Router();
const adminRouter = express.Router();

function normalizeAd(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id || ""),
    title: doc.title || "",
    image: doc.image || "",
    link: doc.link || "",
    slot: doc.slot || "",
    active: Boolean(doc.active),
    impressions: Number(doc.impressions || 0),
    clicks: Number(doc.clicks || 0),
    startDate: doc.startDate || null,
    endDate: doc.endDate || null,
    createdAt: doc.createdAt || null
  };
}

function activeAdFilter(slot) {
  const now = new Date();
  const filter = {
    active: true,
    $or: [
      { startDate: null },
      { startDate: { $lte: now } }
    ],
    $and: [
      {
        $or: [
          { endDate: null },
          { endDate: { $gte: now } }
        ]
      }
    ]
  };

  if (slot) {
    filter.slot = slot;
  }

  return filter;
}

function sanitizePayload(input = {}) {
  return {
    title: String(input.title || "").trim(),
    image: String(input.image || "").trim(),
    link: String(input.link || "").trim(),
    slot: String(input.slot || "").trim(),
    active: input.active !== undefined ? Boolean(input.active) : true,
    startDate: input.startDate ? new Date(input.startDate) : null,
    endDate: input.endDate ? new Date(input.endDate) : null
  };
}

router.get("/", async (_req, res) => {
  try {
    const ads = await Ad.find(activeAdFilter())
      .sort({ createdAt: -1 })
      .lean();
    res.json(ads.map(normalizeAd));
  } catch (err) {
    console.error("ADS LIST ERROR:", err);
    res.status(500).json({ error: "ads_fetch_failed" });
  }
});

router.get("/:slot", async (req, res) => {
  try {
    const ads = await Ad.find(activeAdFilter(req.params.slot))
      .sort({ createdAt: -1 })
      .lean();
    res.json(ads.map(normalizeAd));
  } catch (err) {
    console.error("ADS SLOT ERROR:", err);
    res.status(500).json({ error: "ads_fetch_failed" });
  }
});

adminRouter.use(authMiddleware, authAdmin);

adminRouter.post("/", async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);
    const ad = await Ad.create(payload);
    res.status(201).json(normalizeAd(ad.toObject()));
  } catch (err) {
    console.error("ADMIN AD CREATE ERROR:", err);
    res.status(400).json({ error: "ad_create_failed" });
  }
});

adminRouter.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.id || ""))) {
      return res.status(400).json({ error: "invalid_ad_id" });
    }

    const payload = sanitizePayload(req.body);
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    ).lean();

    if (!ad) {
      return res.status(404).json({ error: "ad_not_found" });
    }

    res.json(normalizeAd(ad));
  } catch (err) {
    console.error("ADMIN AD UPDATE ERROR:", err);
    res.status(400).json({ error: "ad_update_failed" });
  }
});

adminRouter.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.id || ""))) {
      return res.status(400).json({ error: "invalid_ad_id" });
    }

    const ad = await Ad.findByIdAndDelete(req.params.id).lean();
    if (!ad) {
      return res.status(404).json({ error: "ad_not_found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN AD DELETE ERROR:", err);
    res.status(400).json({ error: "ad_delete_failed" });
  }
});

module.exports = router;
module.exports.adminRouter = adminRouter;
