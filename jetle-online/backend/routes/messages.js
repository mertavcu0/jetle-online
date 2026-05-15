const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const User = require("../models/User");

const router = express.Router();
const messageRateMap = new Map();
const isProduction = process.env.NODE_ENV === "production";
const MESSAGE_RATE_LIMIT = 0;
const MESSAGE_RATE_WINDOW_MS = 1000;
const messageSendCooldownMap = new Map();
const MESSAGE_SEND_COOLDOWN_MS = 0;

function sanitizeText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim();
}

function isMessageRateAllowed(userId) {
  return true;
  const now = Date.now();
  const timestamps = (messageRateMap.get(String(userId || "")) || [])
    .filter((timestamp) => now - timestamp < MESSAGE_RATE_WINDOW_MS);

  if (timestamps.length >= MESSAGE_RATE_LIMIT) {
    messageRateMap.set(String(userId || ""), timestamps);
    return false;
  }

  timestamps.push(now);
  messageRateMap.set(String(userId || ""), timestamps);
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamps] of messageRateMap.entries()) {
    const fresh = timestamps.filter((timestamp) => now - timestamp < MESSAGE_RATE_WINDOW_MS);
    if (fresh.length) {
      messageRateMap.set(userId, fresh);
    } else {
      messageRateMap.delete(userId);
    }
  }
}, 30 * 1000).unref();

setInterval(() => {
  const now = Date.now();
  for (const [userId, lastSentAt] of messageSendCooldownMap.entries()) {
    if (now - lastSentAt >= MESSAGE_SEND_COOLDOWN_MS) {
      messageSendCooldownMap.delete(userId);
    }
  }
}, 30 * 1000).unref();

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function asObjectId(value) {
  return new mongoose.Types.ObjectId(String(value));
}

function makeConversationId(listingId, senderId, receiverId) {
  const users = [String(senderId), String(receiverId)].sort();
  return `listing:${String(listingId)}:users:${users.join("__")}`;
}

function parseConversationId(value) {
  const decoded = decodeURIComponent(String(value || ""));
  const parts = decoded.split(":users:");
  if (parts.length !== 2 || !parts[0].startsWith("listing:")) {
    return null;
  }

  const listingId = parts[0].slice("listing:".length);
  const users = parts[1].split("__").filter(Boolean);
  if (users.length !== 2) {
    return null;
  }

  return {
    listingId,
    userIds: users
  };
}

async function getUserFromToken(req) {
  try {
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jetle-dev-secret");
    if (!decoded?.id || !isValidObjectId(decoded.id)) return null;

    return await User.findById(decoded.id).select("_id name email");
  } catch (_) {
    return null;
  }
}

async function requireAuth(req, res, next) {
  try {
    const tokenUser = await getUserFromToken(req);
    if (!tokenUser) {
      return res.status(401).json({ success: false, error: "unauthorized" });
    }

    req.user = tokenUser;
    next();
  } catch (err) {
    console.error("MESSAGES AUTH ERROR:", err);
    return res.status(401).json({ success: false, error: "unauthorized" });
  }
}

function normalizeImage(listing) {
  const firstImage = Array.isArray(listing?.images) && listing.images.length
    ? listing.images[0]
    : listing?.image;

  if (!firstImage) return "";
  if (String(firstImage).startsWith("http") || String(firstImage).startsWith("data:")) {
    return String(firstImage);
  }
  return `/${String(firstImage).replace(/^\/+/, "")}`;
}

function normalizeListing(listing) {
  if (!listing) return null;

  return {
    id: String(listing._id),
    title: listing.title || "Ilan",
    price: listing.price || 0,
    city: listing.city || "",
    image: normalizeImage(listing)
  };
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name || user.email || "Kullanici",
    email: user.email || ""
  };
}

function normalizeMessage(doc) {
  return {
    id: String(doc._id),
    conversationId: String(doc.conversationId || ""),
    senderId: String(doc.senderId?._id || doc.senderId),
    receiverId: String(doc.receiverId?._id || doc.receiverId),
    listingId: String(doc.listingId?._id || doc.listingId),
    text: doc.text || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    isRead: Boolean(doc.isRead),
    isDeleted: Boolean(doc.isDeleted),
    edited: Boolean(doc.edited),
    sender: normalizeUser(doc.senderId?._id ? doc.senderId : null),
    receiver: normalizeUser(doc.receiverId?._id ? doc.receiverId : null)
  };
}

router.use(requireAuth);

async function resolveReceiverFromListing(listing, currentUserId, fallbackReceiverEmail = "") {
  const receiverEmail = String(
    listing?.user?.email ||
    listing?.email ||
    fallbackReceiverEmail ||
    ""
  ).trim().toLowerCase();
  const receiverId = listing?.user?._id ? String(listing.user._id) : "";

  if (!receiverEmail || !receiverId || String(receiverId) === String(currentUserId)) {
    return null;
  }

  return await User.findById(receiverId).select("_id name email");
}

router.get("/conversations", async (req, res) => {
  try {
    const currentUserId = String(req.user?._id || "").trim();

    if (!currentUserId || !isValidObjectId(currentUserId)) {
      return res.json({ success: true, conversations: [] });
    }

    const query = {};
    const userObjectId = asObjectId(currentUserId);
    query.$or = [
      { senderId: userObjectId },
      { receiverId: userObjectId }
    ];

    const messages = await Message.find(query)
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    if (!Array.isArray(messages) || !messages.length) {
      return res.json({ success: true, conversations: [] });
    }

    const listingIds = Array.from(
      new Set(
        messages
          .map((message) => String(message.listingId || "").trim())
          .filter((id) => id && isValidObjectId(id))
      )
    );

    let listingMap = new Map();
    if (listingIds.length) {
      try {
        const listings = await Listing.find({ _id: { $in: listingIds.map((id) => asObjectId(id)) } })
          .select("title")
          .lean();
        listingMap = new Map(
          listings.map((listing) => [String(listing._id), listing])
        );
      } catch (err) {
        console.error("CONVERSATIONS LISTING LOOKUP ERROR:", err);
      }
    }

    const conversationMap = new Map();

    for (const message of messages) {
      try {
        const listingId = String(message.listingId || "").trim();
        if (!listingId) continue;

        const senderId = message.senderId && isValidObjectId(message.senderId)
          ? String(message.senderId)
          : "";
        const receiverId = message.receiverId && isValidObjectId(message.receiverId)
          ? String(message.receiverId)
          : "";
        const senderEmail = String(message.senderEmail || "").trim().toLowerCase();
        const receiverEmail = String(message.receiverEmail || "").trim().toLowerCase();

        const isSenderCurrent = currentUserId && senderId === currentUserId;
        const isReceiverCurrent = currentUserId && receiverId === currentUserId;

        if (!isSenderCurrent && !isReceiverCurrent) continue;

        const otherUserEmail = isSenderCurrent ? receiverEmail : senderEmail;
        const otherUserId = isSenderCurrent ? receiverId : senderId;
        const otherUserName = otherUserEmail || otherUserId || "Kullanici";
        const conversationId = `listing:${listingId}:user:${otherUserId || otherUserEmail || "unknown"}`;
        const listing = listingMap.get(listingId);

        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            conversationId: otherUserId ? makeConversationId(listingId, currentUserId, otherUserId) : "",
            listingId,
            listingTitle: listing?.title || "Ilan",
            lastMessage: message.text || "",
            updatedAt: message.updatedAt || message.createdAt || null,
            unreadCount: 0,
            otherUserId,
            otherUserName,
            otherUserEmail
          });
        }
      } catch (itemErr) {
        console.error("CONVERSATIONS ITEM ERROR:", itemErr);
      }
    }

    return res.json({
      success: true,
      conversations: Array.from(conversationMap.values())
    });
  } catch (err) {
    console.error("CONVERSATIONS ERROR REAL:", err);
    return res.status(200).json({
      success: true,
      conversations: [],
      debugError: err?.message || "unknown_error"
    });
  }
});

router.get("/listing/:listingId", async (req, res) => {
  try {
    const currentUser = req.user;
    const listingId = String(req.params.listingId || "").trim();

    if (!currentUser || !isValidObjectId(listingId)) {
      return res.status(200).json({
        success: false,
        message: "Konuşma bulunamadı",
        conversation: null
      });
    }

    const listing = await Listing.findById(listingId).populate("user", "_id name email");
    if (!listing || !listing.user?._id) {
      return res.status(200).json({
        success: false,
        message: "Konuşma bulunamadı",
        conversation: null
      });
    }

    const currentUserId = String(currentUser._id);
    const otherUserId = String(listing.user._id);
    if (!currentUserId || !otherUserId || currentUserId === otherUserId) {
      return res.status(200).json({
        success: false,
        message: "Konuşma bulunamadı",
        conversation: null
      });
    }

    const messages = await Message.find({
      listingId: asObjectId(listingId),
      isDeleted: false,
      $or: [
        { senderId: asObjectId(currentUserId), receiverId: asObjectId(otherUserId) },
        { senderId: asObjectId(otherUserId), receiverId: asObjectId(currentUserId) }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .lean();

    if (!Array.isArray(messages) || !messages.length) {
      return res.status(200).json({
        success: false,
        message: "Konuşma bulunamadı",
        conversation: null,
        listing: normalizeListing(listing),
        otherUser: normalizeUser(listing.user)
      });
    }

    const orderedMessages = messages.reverse();
    const conversationId = makeConversationId(listingId, currentUserId, otherUserId);

    return res.status(200).json({
      success: true,
      conversation: {
        id: conversationId,
        conversationId,
        listingId,
        listingTitle: listing.title || "Ilan",
        updatedAt: orderedMessages[orderedMessages.length - 1]?.updatedAt ||
          orderedMessages[orderedMessages.length - 1]?.createdAt ||
          null,
        otherUserId,
        otherUserName: listing.user?.name || listing.user?.email || "Kullanici",
        otherUserEmail: listing.user?.email || ""
      },
      listing: normalizeListing(listing),
      otherUser: normalizeUser(listing.user),
      messages: orderedMessages.map(normalizeMessage),
      pageInfo: {
        limit: 50,
        hasMore: messages.length === 50,
        nextBefore: orderedMessages[0]?.createdAt || null
      }
    });
  } catch (err) {
    console.error("MESSAGE LISTING LOOKUP ERROR:", err);
    return res.status(200).json({
      success: false,
      message: "Konuşma bulunamadı",
      conversation: null
    });
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const legacyUserId = String(req.params.conversationId || "").trim();
    if (isValidObjectId(legacyUserId) && legacyUserId === String(currentUser._id)) {
      const legacyMessages = await Message.find({
        isDeleted: false,
        $or: [
          { senderId: asObjectId(legacyUserId) },
          { receiverId: asObjectId(legacyUserId) }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(100)
        .populate("listingId", "title")
        .populate("senderId", "email name")
        .populate("receiverId", "email name")
        .lean();

      return res.json(
        legacyMessages.map((message) => ({
          _id: String(message._id),
          sender: String(message.senderId?.email || message.senderId?._id || ""),
          receiver: String(message.receiverId?.email || message.receiverId?._id || ""),
          message: message.text || "",
          createdAt: message.createdAt,
          listingId: message.listingId
            ? {
                _id: String(message.listingId._id),
                title: message.listingId.title || "Ilan"
              }
            : null
        }))
      );
    }

    const parsed = parseConversationId(req.params.conversationId);
    if (!parsed || !isValidObjectId(parsed.listingId) || parsed.userIds.some((id) => !isValidObjectId(id))) {
      return res.status(400).json({ error: "invalid_conversation" });
    }

    const currentUserId = String(currentUser._id);
    if (!parsed.userIds.includes(currentUserId)) {
      return res.status(403).json({ error: "forbidden" });
    }

    const [userA, userB] = parsed.userIds;
    const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);
    const before = String(req.query.before || "").trim();
    const listing = await Listing.findById(parsed.listingId).populate("user", "name email");

    const messageQuery = {
      listingId: asObjectId(parsed.listingId),
      isDeleted: false,
      $or: [
        { senderId: asObjectId(userA), receiverId: asObjectId(userB) },
        { senderId: asObjectId(userB), receiverId: asObjectId(userA) }
      ]
    };

    if (before) {
      const beforeDate = new Date(before);
      if (!Number.isNaN(beforeDate.getTime())) {
        messageQuery.createdAt = { $lt: beforeDate };
      }
    }

    const messages = await Message.find(messageQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .lean();
    const orderedMessages = messages.reverse();

    await Message.updateMany(
      {
        listingId: asObjectId(parsed.listingId),
        senderId: { $ne: currentUser._id },
        receiverId: currentUser._id,
        isDeleted: false,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    const otherUserId = parsed.userIds.find((id) => id !== currentUserId) || currentUserId;
    const otherUser = await User.findById(otherUserId).select("_id name email");

    const conversationId = makeConversationId(parsed.listingId, userA, userB);
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("messages_seen", {
        conversationId,
        seenByUserId: currentUserId,
        seenAt: new Date().toISOString()
      });
    }

    res.json({
      id: conversationId,
      listing: normalizeListing(listing),
      otherUser: normalizeUser(otherUser),
      messages: orderedMessages.map(normalizeMessage),
      pageInfo: {
        limit,
        hasMore: messages.length === limit,
        nextBefore: orderedMessages.length
          ? orderedMessages[0].createdAt
          : null
      }
    });
  } catch (err) {
    console.error("MESSAGE DETAIL ERROR:", err);
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const text = sanitizeText(req.body.text);
    const listingId = String(req.body.listingId || "").trim();
    const currentUser = req.user;
    const currentUserId = String(currentUser?._id || "");
    console.log("SEND MESSAGE HIT", {
      userId: req.user?._id,
      body: req.body
    });

    const missing = [];

    if (!listingId) missing.push("listingId");
    if (!text) missing.push("text");
    if (text.length > 2000) missing.push("text_too_long");

    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: "invalid_payload",
        missing
      });
    }

    if (!isValidObjectId(listingId)) {
      return res.status(400).json({
        success: false,
        error: "invalid_payload",
        missing: ["listingId"]
      });
    }

    let listingDoc;
    try {
      console.log("[STEP 1 START] Listing.findById populate user");
      listingDoc = await Listing.findById(listingId).populate({
        path: "user",
        select: "_id name email username"
      });
      console.log("[STEP 1 OK] Listing.findById populate user");
    } catch (err) {
      console.error("[STEP 1 FAIL]", err);
      throw err;
    }
    if (!listingDoc) {
      return res.status(404).json({ success: false, error: "listing_not_found" });
    }

    const listing = listingDoc?.toObject ? listingDoc.toObject() : listingDoc;
    const listingOwnerId = String(listingDoc?.user?._id || listing?.user?._id || listing?.user || "").trim();
    console.log("LISTING USER ID", listing?.user?._id || listing?.user);

    let receiver;
    try {
      console.log("[STEP 2 START] resolveReceiverFromListing");
      if (listingOwnerId) {
        receiver = await User.findById(listingOwnerId).select("_id name email username");
      }
      console.log("RECEIVER FOUND", receiver?._id, receiver?.email);
      console.log("[STEP 2 OK] resolveReceiverFromListing");
    } catch (err) {
      console.error("[STEP 2 FAIL]", err);
      throw err;
    }
    if (!receiver) {
      console.error("RECEIVER EMAIL NOT FOUND", {
        listingId,
        listingUser: listingDoc?.user || null,
        body: req.body
      });
      return res.status(400).json({ success: false, error: "receiver_not_found" });
    }

    const senderEmail = String(currentUser.email || "").trim().toLowerCase();
    const receiverEmail = String(
      receiver?.email ||
      listingDoc?.user?.email ||
      ""
    ).trim().toLowerCase();

    if (String(receiver._id) === String(currentUser._id)) {
      return res.status(400).json({ success: false, error: "same_user" });
    }

    let message;
    try {
      console.log("[STEP 3 START] Message.create");
      message = await Message.create({
        senderId: currentUser._id,
        receiverId: receiver._id,
        senderEmail,
        receiverEmail,
        conversationId: makeConversationId(listingId, currentUser._id, receiver._id),
        listingId: listingDoc._id,
        text,
        isRead: false,
        isDeleted: false,
        edited: false
      });
      console.log("[STEP 3 OK] Message.create");
    } catch (err) {
      console.error("[STEP 3 FAIL]", err);
      throw err;
    }

    const savedMessage = await Message.findById(message._id)
      .populate("senderId", "name email")
      .populate("receiverId", "name email");
    const normalizedMessage = normalizeMessage(savedMessage);
    const conversationId = makeConversationId(listingId, currentUser._id, receiver._id);

    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("new_message", {
        ...normalizedMessage,
        conversationId
      });
    }

    res.json({
      success: true,
      conversationId,
      message: normalizedMessage
    });
    messageSendCooldownMap.set(currentUserId, Date.now());
  } catch (err) {
    console.error("SEND MESSAGE REAL ERROR:", err);
    const payload = {
      success: false,
      error: "server_error"
    };
    if (process.env.NODE_ENV !== "production") {
      payload.debugError = err?.message || "unknown_error";
      payload.debugStack = err?.stack || "";
    }
    return res.status(500).json(payload);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "invalid_message_id" });
    }

    const text = sanitizeText(req.body.text);
    if (!text || text.length > 2000) {
      return res.status(400).json({ error: "invalid_text" });
    }

    const message = await Message.findById(req.params.id);
    if (!message || message.isDeleted) {
      return res.status(404).json({ error: "message_not_found" });
    }

    if (String(message.senderId) !== String(currentUser._id)) {
      return res.status(403).json({ error: "forbidden" });
    }

    message.text = text;
    message.edited = true;
    await message.save();

    const populated = await Message.findById(message._id)
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    res.json({
      success: true,
      message: normalizeMessage(populated)
    });
  } catch (err) {
    console.error("MESSAGE UPDATE ERROR:", err);
    res.status(500).json({ error: "server_error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.query.scope === "conversation") {
      const parsed = parseConversationId(req.params.id);
      if (!parsed || !isValidObjectId(parsed.listingId) || parsed.userIds.some((id) => !isValidObjectId(id))) {
        return res.status(400).json({ error: "invalid_conversation" });
      }

      if (!parsed.userIds.includes(String(currentUser._id))) {
        return res.status(403).json({ error: "forbidden" });
      }

      await Message.updateMany(
        {
          listingId: asObjectId(parsed.listingId),
          isDeleted: false,
          $or: [
            { senderId: asObjectId(parsed.userIds[0]), receiverId: asObjectId(parsed.userIds[1]) },
            { senderId: asObjectId(parsed.userIds[1]), receiverId: asObjectId(parsed.userIds[0]) }
          ]
        },
        {
          $set: { isDeleted: true }
        }
      );

      return res.json({ success: true });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "invalid_message_id" });
    }

    const message = await Message.findById(req.params.id);
    if (!message || message.isDeleted) {
      return res.status(404).json({ error: "message_not_found" });
    }

    if (String(message.senderId) !== String(currentUser._id)) {
      return res.status(403).json({ error: "forbidden" });
    }

    message.isDeleted = true;
    await message.save();

    res.json({ success: true });
  } catch (err) {
    console.error("MESSAGE DELETE ERROR:", err);
    res.status(500).json({ error: "server_error" });
  }
});

module.exports = router;
