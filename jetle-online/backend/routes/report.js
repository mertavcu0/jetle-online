const router = require("express").Router();
const auth = require("../middleware/auth");
const Report = require("../models/Report");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

router.post("/", auth, async (req, res) => {
  try {
    const { listingId, reason } = req.body;

    if (!listingId || !reason) {
      return res.status(400).json({ error: "İlan ve şikayet sebebi gerekli" });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const report = await Report.create({
      listingId,
      userId: req.user.id,
      user: req.user.id,
      listing: listingId,
      reason: String(reason).trim()
    });

    await Notification.create({
      type: "report",
      message: `Yeni şikayet: ${listing.title || listingId}`
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("new_report", {
        report,
        message: `Yeni şikayet: ${listing.title || listingId}`
      });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Server hatası" });
  }
});

module.exports = router;
