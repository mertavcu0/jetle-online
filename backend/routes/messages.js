const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function conversationFilter(currentUserId, otherUserId, listingId) {
  return {
    listing: listingId,
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId },
    ],
  };
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiver, listingId, listing, text } = req.body;
    const listingValue = listingId || listing;

    if (!receiver || !listingValue || !text?.trim()) {
      return res.status(400).json({ message: "Alıcı, ilan ve mesaj zorunlu" });
    }

    if (!isValidId(receiver) || !isValidId(listingValue)) {
      return res.status(400).json({ message: "Geçersiz mesaj bilgisi" });
    }

    const listingDoc = await Listing.findById(listingValue);
    if (!listingDoc) {
      return res.status(404).json({ message: "İlan bulunamadı" });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      listing: listingValue,
      text: text.trim(),
      seen: false,
    });

    await User.findByIdAndUpdate(receiver, {
      $push: {
        notifications: {
          text: "Yeni mesaj geldi",
          link: `/ilan-detay.html?id=${listingValue}`,
        },
      },
    });

    const populated = await message.populate([
      { path: "sender", select: "username email" },
      { path: "receiver", select: "username email" },
      { path: "listing", select: "title price images image city category" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/unread/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidId(userId)) {
      return res.status(400).json({ message: "Geçersiz kullanıcı bilgisi" });
    }

    if (String(req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz yok" });
    }

    const count = await Message.countDocuments({
      receiver: userId,
      seen: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/seen/:listingId/:userId", authMiddleware, async (req, res) => {
  try {
    const { listingId, userId } = req.params;

    if (!isValidId(listingId) || !isValidId(userId)) {
      return res.status(400).json({ message: "Geçersiz mesaj bilgisi" });
    }

    if (String(req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz yok" });
    }

    await Message.updateMany(
      {
        listing: listingId,
        receiver: userId,
        seen: false,
      },
      { seen: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Geçersiz mesaj bilgisi" });
    }

    const msg = await Message.findById(id);
    if (!msg) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    if (String(msg.sender) !== String(req.user._id)) {
      return res.status(403).json({ message: "Sadece kendi mesajını silebilirsin" });
    }

    await msg.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:listingId/:userId", authMiddleware, async (req, res) => {
  try {
    const { listingId, userId } = req.params;

    if (!isValidId(listingId) || !isValidId(userId)) {
      return res.status(400).json({ message: "Geçersiz konuşma bilgisi" });
    }

    const messages = await Message.find(conversationFilter(req.user._id, userId, listingId))
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .populate("listing", "title price images image city category")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .populate("listing", "title price images image city category")
      .sort({ createdAt: -1 });

    const map = new Map();
    messages.forEach((message) => {
      const other = String(message.sender?._id) === String(req.user._id)
        ? message.receiver
        : message.sender;
      if (!message.listing || !other) return;
      const key = `${message.listing?._id}-${other?._id}`;

      if (!map.has(key)) {
        map.set(key, {
          listing: message.listing,
          user: other,
          lastMessage: message.text,
          updatedAt: message.createdAt,
        });
      }
    });

    res.json([...map.values()]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
