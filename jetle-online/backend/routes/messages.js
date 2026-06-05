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

function normalizeId(value) {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$ne) value = value.$ne;
    else if (value._id) value = value._id;
  }

  return String(value || "")
    .trim()
    .replace(/^users:/, "")
    .replace(/^_+/, "")
    .replace(/_+$/, "");
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
  const users = parts[1]
    .split("__")
    .map(normalizeId)
    .filter(Boolean);
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

    const jwtSecret = String(process.env.JWT_SECRET || "").trim();
    if (!jwtSecret) return null;
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded?.id || !isValidObjectId(decoded.id)) return null;

    return await User.findById(decoded.id).select("_id name email role username");
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
    console.log("SERVER_AFTER_AUTH", {
      reqUser: req.user,
      authUser: req.auth,
      body: req.body
    });
    next();
  } catch (err) {
    console.error("MESSAGES AUTH ERROR:", err);
    return res.status(401).json({ success: false, error: "unauthorized" });
  }
}

function normalizeImage(listing) {
  const firstImage =
    listing?.coverImage ||
    listing?.mainImage ||
    ((Array.isArray(listing?.images) && listing.images.length) ? listing.images[0] : "") ||
    ((Array.isArray(listing?.photos) && listing.photos.length) ? listing.photos[0] : "") ||
    listing?.image ||
    "";

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
    title: listing.title || "İlan",
    price: listing.price || 0,
    city: listing.city || "",
    image: normalizeImage(listing),
    coverImage: listing.coverImage || listing.mainImage || "",
    images: Array.isArray(listing.images) ? listing.images.filter(Boolean) : [],
    photos: Array.isArray(listing.photos) ? listing.photos.filter(Boolean) : [],
    user: listing.user
      ? {
          _id: String(listing.user._id || listing.user),
          name: listing.user.name || listing.user.username || listing.user.email || "",
          username: listing.user.username || "",
          email: listing.user.email || ""
        }
      : null
  };
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name || user.email || "Kullanıcı",
    email: user.email || ""
  };
}

function extractOwnerIdCandidates(listing) {
  return [
    listing?.owner?._id,
    listing?.owner,
    listing?.user?._id,
    listing?.user,
    listing?.userId?._id,
    listing?.userId,
    listing?.createdBy?._id,
    listing?.createdBy
  ]
    .map((value) => normalizeId(value))
    .filter(Boolean);
}

function resolveListingOwnerId(listing, currentUserId = "") {
  const safeCurrentUserId = normalizeId(currentUserId);
  const rawCandidates = extractOwnerIdCandidates(listing);
  const uniqueCandidates = [...new Set(rawCandidates)];
  const validCandidates = uniqueCandidates.filter((value) => isValidObjectId(value));
  const nonCurrentCandidates = validCandidates.filter((value) => value !== safeCurrentUserId);
  const ownerId = nonCurrentCandidates[0] || validCandidates[0] || "";

  console.log("CONVERSATION_CURRENT_USER", safeCurrentUserId);
  console.log("CONVERSATION_LISTING_OWNER", {
    ownerId,
    candidates: uniqueCandidates,
    validCandidates,
    nonCurrentCandidates
  });
  console.log("CONVERSATION_USERS_ARRAY", [safeCurrentUserId, ownerId].filter(Boolean));

  return ownerId;
}

function resolveReceiverIdFromConversationId(conversationId, currentUserId = "") {
  const safeCurrentUserId = normalizeId(currentUserId);
  const rawUsers = String(conversationId || "").split("users:")[1] || "";
  console.log("RAW_USERS_STRING", rawUsers);
  const userIds = rawUsers
    .split("_")
    .map(normalizeId)
    .filter(Boolean);
  console.log("PARSED_USERS_FINAL", userIds);
  console.log("CURRENT_USER_FINAL", safeCurrentUserId);
  const otherUserId = userIds.find((id) => {
    const normalizedId = String(id).trim();
    const normalizedCurrent = String(safeCurrentUserId).trim();
    console.log("COMPARE_DEBUG", {
      rawId: id,
      rawCurrent: safeCurrentUserId,
      normalizedId,
      normalizedCurrent,
      equal: normalizedId === normalizedCurrent
    });
    return normalizedId !== normalizedCurrent;
  }) || "";
  console.log("RECEIVER_FROM_USERS", otherUserId);

  return {
    userIds,
    otherUserId
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

function isAdminUser(user) {
  const role = String(user?.role || "").trim().toLowerCase();
  return role === "admin" || role === "superadmin";
}

function logPrivacyEvent(eventName, payload = {}) {
  console.log(eventName, payload);
}

async function resolvePrivateThreadAccess({
  currentUser,
  listingId,
  requestedConversationId = "",
  requestedReceiverId = ""
}) {
  const currentUserId = normalizeId(currentUser?._id);
  const admin = isAdminUser(currentUser);

  if (!currentUserId || !isValidObjectId(currentUserId)) {
    return { error: "unauthorized", status: 401 };
  }

  if (!isValidObjectId(listingId)) {
    return { error: "invalid_listing_id", status: 400 };
  }

  const listing = await Listing.findById(listingId).populate("user", "_id name email username");
  if (!listing) {
    return { error: "listing_not_found", status: 404 };
  }

  const listingOwnerId = normalizeId(resolveListingOwnerId(listing, currentUserId));
  if (!listingOwnerId || !isValidObjectId(listingOwnerId)) {
    return { error: "listing_owner_not_found", status: 400 };
  }

  let participantIds = [];
  let otherUserId = "";

  if (requestedConversationId) {
    const parsed = parseConversationId(requestedConversationId);
    if (
      !parsed ||
      !isValidObjectId(parsed.listingId) ||
      normalizeId(parsed.listingId) !== normalizeId(listingId) ||
      parsed.userIds.some((id) => !isValidObjectId(id))
    ) {
      return { error: "invalid_conversation", status: 400 };
    }

    participantIds = parsed.userIds.map(normalizeId);
    if (!admin && !participantIds.includes(currentUserId)) {
      logPrivacyEvent("UNAUTHORIZED_THREAD_BLOCKED", {
        reason: "current_user_not_participant",
        listingId,
        currentUserId,
        conversationId: requestedConversationId
      });
      return { error: "forbidden", status: 403 };
    }

    if (!admin && !participantIds.includes(listingOwnerId)) {
      logPrivacyEvent("UNAUTHORIZED_THREAD_BLOCKED", {
        reason: "listing_owner_not_in_thread",
        listingId,
        listingOwnerId,
        conversationId: requestedConversationId
      });
      return { error: "forbidden", status: 403 };
    }

    otherUserId = participantIds.find((id) => id !== currentUserId) || "";
  } else {
    const normalizedRequestedReceiverId = normalizeId(requestedReceiverId);

    if (currentUserId === listingOwnerId) {
      otherUserId = normalizedRequestedReceiverId;
    } else {
      otherUserId = listingOwnerId;
    }

    if (!otherUserId || !isValidObjectId(otherUserId)) {
      return { error: "receiver_not_found", status: 400 };
    }

    if (otherUserId === currentUserId) {
      return { error: "same_user", status: 400 };
    }

    participantIds = [currentUserId, otherUserId].sort();

    if (!admin && !participantIds.includes(listingOwnerId)) {
      logPrivacyEvent("UNAUTHORIZED_THREAD_BLOCKED", {
        reason: "listing_owner_not_in_thread",
        listingId,
        listingOwnerId,
        currentUserId,
        otherUserId
      });
      return { error: "forbidden", status: 403 };
    }
  }

  return {
    success: true,
    admin,
    listing,
    listingOwnerId,
    currentUserId,
    otherUserId,
    participantIds,
    conversationId: makeConversationId(listingId, participantIds[0], participantIds[1])
  };
}

router.use(requireAuth);

async function resolveReceiverFromListing(listing, currentUserId, fallbackReceiverEmail = "") {
  const receiverEmail = String(
    listing?.owner?.email ||
    listing?.user?.email ||
    listing?.userId?.email ||
    listing?.createdBy?.email ||
    listing?.email ||
    fallbackReceiverEmail ||
    ""
  ).trim().toLowerCase();
  const receiverId = resolveListingOwnerId(listing, currentUserId);

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

    const query = { isDeleted: false };
    const safeCurrentUserId = normalizeId(currentUserId);
    const userObjectId = asObjectId(safeCurrentUserId);
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
        const listingResults = await Promise.all(
          listingIds.map(async (id) => {
            if (!isValidObjectId(id)) return null;
            return await Listing.findById(id)
              .select("title price city image images photos coverImage mainImage user")
              .populate("user", "_id name email username")
              .lean();
          })
        );
        const listings = listingResults.filter(Boolean);
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

        const listing = listingMap.get(listingId);
        if (!listing) continue;
        const otherUserEmail = isSenderCurrent ? receiverEmail : senderEmail;
        const otherUserId = isSenderCurrent ? receiverId : senderId;
        const listingOwnerId = String(listing?.user?._id || "").trim();
        if (!listingOwnerId || ![senderId, receiverId].includes(listingOwnerId)) {
          logPrivacyEvent("UNAUTHORIZED_THREAD_BLOCKED", {
            reason: "conversation_without_listing_owner",
            listingId,
            senderId,
            receiverId,
            currentUserId
          });
          continue;
        }
        const listingOwnerEmail = String(listing?.user?.email || "").trim().toLowerCase();
        const listingOwnerName = String(
          listing?.user?.name ||
          listing?.user?.username ||
          listing?.user?.email ||
          ""
        ).trim();
        const otherUserName =
          otherUserId === listingOwnerId
            ? (listingOwnerName || listingOwnerEmail || otherUserEmail || otherUserId || "Kullanıcı")
            : (otherUserEmail || otherUserId || "Kullanıcı");
        const canonicalConversationId =
          otherUserId && isValidObjectId(otherUserId)
            ? makeConversationId(listingId, currentUserId, otherUserId)
            : "";

        if (!canonicalConversationId) continue;
        logPrivacyEvent("THREAD_ISOLATION_OK", {
          currentUserId,
          listingId,
          conversationId: canonicalConversationId
        });

        if (!conversationMap.has(canonicalConversationId)) {
          conversationMap.set(canonicalConversationId, {
            id: canonicalConversationId,
            conversationId: canonicalConversationId,
            listingId,
            listing: normalizeListing(listing),
            listingTitle: listing?.title || "İlan",
            listingImage: normalizeImage(listing),
            listingPrice: listing?.price || 0,
            listingCity: listing?.city || "",
            lastMessage: message.text || "",
            updatedAt: message.updatedAt || message.createdAt || null,
            unreadCount: 0,
            sellerId: listingOwnerId,
            buyerId: currentUserId === listingOwnerId ? otherUserId : currentUserId,
            otherUserId,
            otherUserName,
            otherUserEmail,
            otherUser: {
              _id: otherUserId,
              name: otherUserName,
              email: otherUserEmail
            }
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

    const access = await resolvePrivateThreadAccess({ currentUser, listingId });
    if (!access.success) {
      return res.status(200).json({
        success: false,
        message: "Konuşma bulunamadı",
        conversation: null
      });
    }

    const { listing, currentUserId, otherUserId, conversationId } = access;
    if (!otherUserId || !isValidObjectId(otherUserId) || currentUserId === otherUserId) {
      return res.status(200).json({
        success: false,
        message: "Konuşma bulunamadı",
        conversation: null
      });
    }

    const otherUser = await User.findById(otherUserId).select("_id name email");
    const listingObjectId = asObjectId(listingId);
    const messages = await Message.find({
      listingId: listingObjectId,
      isDeleted: false,
      $or: [
        { senderId: asObjectId(currentUserId), receiverId: asObjectId(otherUserId) },
        { senderId: asObjectId(otherUserId), receiverId: asObjectId(currentUserId) }
      ]
    })
      .sort({ createdAt: 1 })
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
        otherUser: normalizeUser(otherUser)
      });
    }

    const orderedMessages = messages;
    logPrivacyEvent("PRIVATE_CONVERSATION_ACTIVE", {
      currentUserId,
      otherUserId,
      listingId,
      conversationId
    });

    return res.status(200).json({
      success: true,
      conversation: {
        id: conversationId,
        conversationId,
        listingId,
        listingTitle: listing.title || "İlan",
        updatedAt: orderedMessages[orderedMessages.length - 1]?.updatedAt ||
          orderedMessages[orderedMessages.length - 1]?.createdAt ||
          null,
        otherUserId,
        otherUserName: otherUser?.name || otherUser?.email || "Kullanıcı",
        otherUserEmail: otherUser?.email || ""
      },
      listing: normalizeListing(listing),
      otherUser: normalizeUser(otherUser),
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

    const parsed = parseConversationId(req.params.conversationId);
    if (!parsed || !isValidObjectId(parsed.listingId) || parsed.userIds.some((id) => !isValidObjectId(id))) {
      return res.status(400).json({ error: "invalid_conversation" });
    }

    const access = await resolvePrivateThreadAccess({
      currentUser,
      listingId: parsed.listingId,
      requestedConversationId: req.params.conversationId
    });
    if (!access.success) {
      return res.status(access.status || 403).json({ error: access.error || "forbidden" });
    }

    const { listing, currentUserId, otherUserId, conversationId, participantIds } = access;
    const [userA, userB] = participantIds;
    const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);
    const before = String(req.query.before || "").trim();
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
      .sort({ createdAt: 1 })
      .limit(limit)
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .lean();
    const orderedMessages = messages;

    await Message.updateMany(
      {
        conversationId,
        receiverId: currentUser._id,
        isDeleted: false,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    const otherUser = await User.findById(otherUserId).select("_id name email");
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("messages_seen", {
        conversationId,
        seenByUserId: currentUserId,
        seenAt: new Date().toISOString()
      });
    }

    logPrivacyEvent("MESSAGE_PRIVACY_OK", {
      currentUserId,
      listingId: parsed.listingId,
      conversationId
    });

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
    const rawBody = req.body || {};
    const text = sanitizeText(rawBody.text || rawBody.message || rawBody.content);
    const listingId = String(rawBody.listingId || "").trim();
    const requestedConversationId = String(rawBody.conversationId || "").trim();
    const receiverIdFromBody = String(rawBody.receiverId || "").trim();
    const currentUser = req.user;
    const currentUserId = normalizeId(currentUser?._id);

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

    const access = await resolvePrivateThreadAccess({
      currentUser,
      listingId,
      requestedConversationId,
      requestedReceiverId: receiverIdFromBody
    });
    if (!access.success) {
      return res.status(access.status || 403).json({
        success: false,
        error: access.error || "forbidden"
      });
    }

    const { listing, otherUserId, conversationId } = access;
    const receiver = await User.findById(otherUserId).select("_id name email username");
    if (!receiver) {
      return res.status(400).json({ success: false, error: "receiver_not_found" });
    }

    const senderEmail = String(currentUser.email || "").trim().toLowerCase();
    const message = await Message.create({
      senderId: currentUser._id,
      receiverId: asObjectId(otherUserId),
      senderEmail,
      receiverEmail: String(receiver?.email || "").trim().toLowerCase(),
      conversationId,
      listingId: listing._id,
      text,
      isRead: false,
      isDeleted: false,
      edited: false
    });

    const savedMessage = await Message.findById(message._id)
      .populate("senderId", "name email")
      .populate("receiverId", "name email");
    const normalizedMessage = normalizeMessage(savedMessage);

    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("new_message", {
        ...normalizedMessage,
        conversationId
      });
    }

    logPrivacyEvent("PRIVATE_CONVERSATION_ACTIVE", {
      currentUserId,
      otherUserId,
      listingId,
      conversationId
    });
    logPrivacyEvent("THREAD_ISOLATION_OK", {
      currentUserId,
      otherUserId,
      listingId,
      conversationId
    });

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

      const access = await resolvePrivateThreadAccess({
        currentUser,
        listingId: parsed.listingId,
        requestedConversationId: req.params.id
      });
      if (!access.success) {
        return res.status(access.status || 403).json({ error: access.error || "forbidden" });
      }

      const [userA, userB] = access.participantIds;

      await Message.updateMany(
        {
          listingId: asObjectId(parsed.listingId),
          isDeleted: false,
          $or: [
            { senderId: asObjectId(userA), receiverId: asObjectId(userB) },
            { senderId: asObjectId(userB), receiverId: asObjectId(userA) }
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


