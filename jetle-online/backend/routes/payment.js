const router = require("express").Router();
const auth = require("../middleware/auth");
const Payment = require("../models/Payment");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

router.post("/boost", async (req, res) => {
  try {
    const { listingId, duration = 3 } = req.body;

    if (!listingId) {
      return res.status(400).json({ error: "listingId zorunlu" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const days = Number(duration) || 3;
    listing.isBoosted = true;
    listing.boostUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await listing.save();

    await Notification.create({
      message: "İlan boost satın aldı",
      type: "boost"
    });

    res.json({
      price: 50,
      success: true,
      listing
    });
  } catch (err) {
    console.error("BOOST PAYMENT ERROR:", err);
    res.status(500).json({ error: "Boost ödeme hatası" });
  }
});

router.post("/create", auth, async (req, res) => {
  try {
    const { listingId, type, amount } = req.body;

    if (!listingId || !["featured", "premium"].includes(type) || !amount) {
      return res.status(400).json({ error: "Geçersiz ödeme isteği" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "İlan bulunamadı" });
    }

    const payment = await Payment.create({
      userId: req.user.id,
      listingId,
      type,
      amount: Number(amount),
      status: "pending"
    });

    const notification = await Notification.create({
      type: "payment",
      message: `Yeni ödeme oluşturuldu: ${type} - ${amount} TL`
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("new_payment", { payment, notification, message: notification.message });
    }

    res.status(201).json({
      payment,
      iyzicoReady: true,
      checkoutPayload: {
        conversationId: String(payment._id),
        price: payment.amount,
        paidPrice: payment.amount,
        currency: "TRY"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/callback", async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: status === "paid" ? "paid" : status === "failed" ? "failed" : "pending" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Ödeme bulunamadı" });
    }

    if (payment.status === "paid" && payment.type === "featured") {
      await Listing.findByIdAndUpdate(payment.listingId, { isFeatured: true });
    }

    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
