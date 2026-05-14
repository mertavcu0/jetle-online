require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const { rateLimit } = require("express-rate-limit");
const listingsRoutes = require("./routes/listings");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");
const carsRoute = require("./routes/cars");
const Listing = require("./models/Listing");
const Message = require("./models/Message");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");
const helmet = require("helmet");

const isProduction = process.env.NODE_ENV === "production";
const hasJwtSecret = Boolean(String(process.env.JWT_SECRET || "").trim());
const hasMongoUri = Boolean(String(process.env.MONGO_URI || "").trim());
const devOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];
const prodOrigins = [
  "https://jetle.online",
  "https://www.jetle.online"
];
const allowedOrigins = isProduction
  ? prodOrigins
  : [...devOrigins, ...prodOrigins];
const MAX_QUERY_KEYS = 30;
const MAX_QUERY_VALUE_LENGTH = 500;
const REQUEST_BODY_LIMIT = "10mb";
const ALLOWED_LISTING_QUERY_KEYS = new Set([
  "q",
  "search",
  "city",
  "location",
  "category",
  "min",
  "minPrice",
  "max",
  "maxPrice",
  "page",
  "limit",
  "sort"
]);

mongoose.set("strictQuery", true);
mongoose.set("sanitizeFilter", true);

if (!hasJwtSecret && isProduction) {
  throw new Error("JWT_SECRET is required in production");
}

if (!hasMongoUri && isProduction) {
  throw new Error("MONGO_URI is required in production");
}

if (!hasJwtSecret && !isProduction) {
  console.warn("WARN JWT_SECRET missing; using development fallback.");
}

if (!hasMongoUri && !isProduction) {
  console.warn("WARN MONGO_URI missing.");
}

const app = express();
const server = http.createServer(app);
app.disable("x-powered-by");
const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      const allowed = !origin || allowedOrigins.includes(origin);
      callback(null, allowed);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  }
});
const PORT = process.env.PORT || 3000;
const requiredProductionEnv = ["MONGO_URI", "JWT_SECRET"];
const missingProductionEnv = requiredProductionEnv.filter(
  (key) => !String(process.env[key] || "").trim()
);
app.set("trust proxy", 1);
app.set("io", io);
app.set("runtimeMetrics", getRuntimeMetrics);
const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    const allowed = allowedOrigins.includes(origin);
    return callback(null, allowed);
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

const helmetOptions = {
  contentSecurityPolicy: isProduction
    ? {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.socket.io"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          connectSrc: ["'self'", "https://jetle.online", "https://www.jetle.online", "wss://jetle.online", "wss://www.jetle.online"],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
          objectSrc: ["'none'"],
          frameAncestors: ["'self'"]
        }
      }
    : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: isProduction ? "same-site" : "cross-origin" },
  referrerPolicy: { policy: "no-referrer" },
  xContentTypeOptions: true,
  frameguard: { action: "sameorigin" },
  hsts: isProduction ? undefined : false
};

function buildLimiter(windowMs, max) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too_many_requests" }
  });
}

const generalApiLimiter = buildLimiter(15 * 60 * 1000, 300);
const authLimiter = buildLimiter(10 * 60 * 1000, 20);
const listingWriteLimiter = buildLimiter(5 * 60 * 1000, 25);
const messageRouteLimiter = buildLimiter(60 * 1000, isProduction ? 120 : 1000);
const adminApiLimiter = buildLimiter(15 * 60 * 1000, 180);

if (!isProduction) {
  console.log("START DEV SERVER");
}

if (isProduction && missingProductionEnv.length) {
  throw new Error(`Missing production env: ${missingProductionEnv.join(", ")}`);
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function stripDangerousKey(key) {
  return String(key || "").replace(/\$/g, "").replace(/\./g, "");
}

function sanitizePlainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim();
}

function sanitizePayload(input) {
  if (Array.isArray(input)) {
    return input.map(sanitizePayload);
  }

  if (!input || typeof input !== "object") {
    return typeof input === "string" ? sanitizePlainText(input) : input;
  }

  const sanitized = {};
  for (const [rawKey, rawValue] of Object.entries(input)) {
    const safeKey = stripDangerousKey(rawKey);
    if (!safeKey) continue;
    sanitized[safeKey] = sanitizePayload(rawValue);
  }
  return sanitized;
}

function isQuerySafe(query) {
  const entries = Object.entries(query || {});
  if (entries.length > MAX_QUERY_KEYS) return false;
  return entries.every(([, value]) => String(value || "").length <= MAX_QUERY_VALUE_LENGTH);
}

function getDbStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  return states[mongoose.connection.readyState] || "unknown";
}

function getRuntimeMetrics() {
  return {
    onlineUsers: onlineUsers.size,
    activeSockets: io.engine.clientsCount,
    totalSocketRooms: socketRoomMap.size
  };
}

async function gracefulShutdown(signal) {
  try {
    if (!isProduction) {
      console.warn(`WARN SHUTDOWN ${signal}`);
    }
    io.close();
    server.close(() => {});
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("SHUTDOWN ERROR:", err);
    process.exit(1);
  }
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

  return { listingId, userIds: users };
}

function safeEmit(target, eventName, payload) {
  try {
    target.emit(eventName, payload);
  } catch (err) {
    console.error("SOCKET EMIT ERROR:", { eventName, err });
  }
}

async function getSocketUser(socket) {
  const token = String(
    socket.handshake?.auth?.token ||
    socket.handshake?.headers?.authorization?.replace(/^Bearer\s+/i, "") ||
    ""
  ).trim();

  if (!token) {
    throw new Error("unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "jetle-dev-secret");
  if (!decoded?.id || !isValidObjectId(decoded.id)) {
    throw new Error("unauthorized");
  }

  const user = await User.findById(decoded.id).select("_id name email banned isBanned");
  if (!user || user.banned || user.isBanned) {
    throw new Error("unauthorized");
  }

  return user;
}

async function canAccessConversation(user, conversationId) {
  const parsed = parseConversationId(conversationId);
  if (!parsed || !isValidObjectId(parsed.listingId) || parsed.userIds.some((id) => !isValidObjectId(id))) {
    return false;
  }

  const currentUserId = String(user?._id || "");
  if (!parsed.userIds.includes(currentUserId)) {
    return false;
  }

  const listing = await Listing.findById(parsed.listingId).select("user");
  if (!listing?.user || !isValidObjectId(listing.user)) {
    return false;
  }

  const listingOwnerId = String(listing.user);
  const otherUserId = parsed.userIds.find((id) => id !== currentUserId) || "";
  if (listingOwnerId === currentUserId || listingOwnerId === otherUserId) {
    return true;
  }

  const existingMessage = await Message.exists({
    listingId: parsed.listingId,
    isDeleted: { $ne: true },
    $or: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId }
    ]
  });

  return Boolean(existingMessage);
}

const onlineUsers = new Map();
const socketRoomMap = new Map();
const typingEventMap = new Map();
const socketMessageRateMap = new Map();
const PRESENCE_TTL_MS = 2 * 60 * 1000;
const SOCKET_MESSAGE_LIMIT = 5;
const SOCKET_MESSAGE_WINDOW_MS = 1000;
const TYPING_DEBOUNCE_MS = 900;

function emitPresenceSnapshot(targetSocket) {
  safeEmit(targetSocket, "presence_snapshot", {
    userIds: Array.from(onlineUsers.entries())
      .filter(([, meta]) => Date.now() - Number(meta?.lastSeenAt || 0) < PRESENCE_TTL_MS)
      .map(([userId]) => userId)
  });
}

function markUserOnline(userId) {
  const previous = onlineUsers.get(userId) || { count: 0, lastSeenAt: 0 };
  const nextMeta = {
    count: previous.count + 1,
    lastSeenAt: Date.now()
  };
  onlineUsers.set(userId, nextMeta);
  if (previous.count === 0) {
    safeEmit(io, "user_online", { userId });
  }
}

function markUserOffline(userId) {
  const currentMeta = onlineUsers.get(userId) || { count: 0, lastSeenAt: 0 };
  if (currentMeta.count <= 1) {
    onlineUsers.delete(userId);
    safeEmit(io, "user_offline", { userId });
    return;
  }

  onlineUsers.set(userId, {
    count: currentMeta.count - 1,
    lastSeenAt: Date.now()
  });
}

function trackSocketRoom(socketId, conversationId) {
  const roomSet = socketRoomMap.get(socketId) || new Set();
  roomSet.add(conversationId);
  socketRoomMap.set(socketId, roomSet);
}

function untrackSocketRoom(socketId, conversationId) {
  const roomSet = socketRoomMap.get(socketId);
  if (!roomSet) return;
  roomSet.delete(conversationId);
  if (!roomSet.size) {
    socketRoomMap.delete(socketId);
  }
}

function clearSocketRooms(socketId) {
  socketRoomMap.delete(socketId);
  typingEventMap.delete(socketId);
}

function isSocketMessageAllowed(userId) {
  const now = Date.now();
  const timestamps = (socketMessageRateMap.get(userId) || [])
    .filter((timestamp) => now - timestamp < SOCKET_MESSAGE_WINDOW_MS);

  if (timestamps.length >= SOCKET_MESSAGE_LIMIT) {
    socketMessageRateMap.set(userId, timestamps);
    return false;
  }

  timestamps.push(now);
  socketMessageRateMap.set(userId, timestamps);
  return true;
}

function cleanupPresenceState() {
  const now = Date.now();

  for (const [userId, meta] of onlineUsers.entries()) {
    if (now - Number(meta?.lastSeenAt || 0) > PRESENCE_TTL_MS) {
      onlineUsers.delete(userId);
      safeEmit(io, "user_offline", { userId });
    }
  }

  for (const [userId, timestamps] of socketMessageRateMap.entries()) {
    const fresh = timestamps.filter((timestamp) => now - timestamp < SOCKET_MESSAGE_WINDOW_MS);
    if (fresh.length) {
      socketMessageRateMap.set(userId, fresh);
    } else {
      socketMessageRateMap.delete(userId);
    }
  }

  for (const [socketId, typingMeta] of typingEventMap.entries()) {
    if (now - Number(typingMeta?.lastEmittedAt || 0) > PRESENCE_TTL_MS) {
      typingEventMap.delete(socketId);
    }
  }
}

setInterval(cleanupPresenceState, 30 * 1000).unref();

io.use(async (socket, next) => {
  try {
    socket.user = await getSocketUser(socket);
    return next();
  } catch (err) {
    return next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userId = String(socket.user._id);
  markUserOnline(userId);
  emitPresenceSnapshot(socket);

  socket.on("join_conversation", async (conversationId, callback) => {
    try {
      const normalizedConversationId = String(conversationId || "").trim();
      if (!normalizedConversationId || !(await canAccessConversation(socket.user, normalizedConversationId))) {
        callback?.({ success: false, error: "forbidden" });
        return;
      }

      await socket.join(normalizedConversationId);
      trackSocketRoom(socket.id, normalizedConversationId);
      callback?.({ success: true });
    } catch (err) {
      console.error("SOCKET JOIN ERROR:", err);
      callback?.({ success: false, error: "server_error" });
    }
  });

  socket.on("leave_conversation", async (conversationId) => {
    const normalizedConversationId = String(conversationId || "").trim();
    if (normalizedConversationId) {
      await socket.leave(normalizedConversationId);
      untrackSocketRoom(socket.id, normalizedConversationId);
    }
  });

  socket.on("typing_start", async ({ conversationId } = {}) => {
    try {
      if (!isSocketMessageAllowed(userId)) {
        return;
      }

      const normalizedConversationId = String(conversationId || "").trim();
      if (!normalizedConversationId || !(await canAccessConversation(socket.user, normalizedConversationId))) {
        return;
      }

      const typingKey = `${socket.id}:${normalizedConversationId}`;
      const lastTyping = typingEventMap.get(typingKey) || { lastEmittedAt: 0 };
      if (Date.now() - lastTyping.lastEmittedAt < TYPING_DEBOUNCE_MS) {
        return;
      }

      typingEventMap.set(typingKey, { lastEmittedAt: Date.now() });
      safeEmit(socket.to(normalizedConversationId), "typing_start", {
        conversationId: normalizedConversationId,
        userId,
        userName: socket.user.name || socket.user.email || "Kullanıcı"
      });
    } catch (err) {
      console.error("SOCKET TYPING START ERROR:", err);
    }
  });

  socket.on("typing_stop", async ({ conversationId } = {}) => {
    try {
      const normalizedConversationId = String(conversationId || "").trim();
      if (!normalizedConversationId || !(await canAccessConversation(socket.user, normalizedConversationId))) {
        return;
      }

      typingEventMap.delete(`${socket.id}:${normalizedConversationId}`);
      safeEmit(socket.to(normalizedConversationId), "typing_stop", {
        conversationId: normalizedConversationId,
        userId
      });
    } catch (err) {
      console.error("SOCKET TYPING STOP ERROR:", err);
    }
  });

  socket.on("seen", async ({ conversationId } = {}, callback) => {
    try {
      if (!isSocketMessageAllowed(userId)) {
        callback?.({ success: false, error: "rate_limited" });
        return;
      }

      const normalizedConversationId = String(conversationId || "").trim();
      const parsed = parseConversationId(normalizedConversationId);
      if (
        !normalizedConversationId ||
        !parsed ||
        !isValidObjectId(parsed.listingId) ||
        parsed.userIds.some((id) => !isValidObjectId(id)) ||
        !(await canAccessConversation(socket.user, normalizedConversationId))
      ) {
        callback?.({ success: false, error: "forbidden" });
        return;
      }

      await Message.updateMany(
        {
          listingId: parsed.listingId,
          senderId: { $ne: socket.user._id },
          receiverId: socket.user._id,
          isDeleted: false,
          isRead: false
        },
        {
          $set: { isRead: true }
        }
      );

      safeEmit(socket.to(normalizedConversationId), "messages_seen", {
        conversationId: normalizedConversationId,
        seenByUserId: userId,
        seenAt: new Date().toISOString()
      });

      callback?.({ success: true });
    } catch (err) {
      console.error("SOCKET SEEN ERROR:", err);
      callback?.({ success: false, error: "server_error" });
    }
  });

  socket.on("disconnect", () => {
    clearSocketRooms(socket.id);
    markUserOffline(userId);
  });
});

// Middleware
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use("/api", generalApiLimiter);
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ limit: REQUEST_BODY_LIMIT, extended: true }));
app.use((req, res, next) => {
  const startedAt = Date.now();
  if (!isProduction) {
    res.on("finish", () => {
      const duration = Date.now() - startedAt;
      console.log(`REQ ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
  }
  next();
});
app.use((req, res, next) => {
  if (!isQuerySafe(req.query)) {
    return res.status(400).json({
      success: false,
      error: "invalid_query"
    });
  }

  req.query = sanitizePayload(req.query || {});
  if (req.path.startsWith("/api/listings")) {
    req.query = Object.fromEntries(
      Object.entries(req.query).filter(([key]) => ALLOWED_LISTING_QUERY_KEYS.has(String(key || "")))
    );
  }
  req.body = sanitizePayload(req.body || {});
  req.params = sanitizePayload(req.params || {});
  next();
});

// API Routes
app.use("/api/auth", authLimiter);
// Temporary diagnostic: disable route-level limiter for /api/messages
// app.use("/api/messages", messageRouteLimiter);
app.post("/api/listings/upload", listingWriteLimiter);
app.post("/api/listings", listingWriteLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminApiLimiter, authMiddleware, adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cars", carsRoute);

app.use((req, res, next) => {
  if (/\.(html|js|json|css)$/i.test(req.path)) {
    res.charset = "utf-8";
  }
  next();
});

app.get("/api/my-listings", authMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id, isDeleted: false });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/test-auth", (req, res) => {
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, "../public"), {
  setHeaders(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".html") res.setHeader("Content-Type", "text/html; charset=utf-8");
    if (ext === ".js") res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    if (ext === ".json") res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (ext === ".css") res.setHeader("Content-Type", "text/css; charset=utf-8");
  }
}));
app.use("/uploads", express.static("uploads", {
  setHeaders(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".json") res.setHeader("Content-Type", "application/json; charset=utf-8");
  }
}));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API Ã§alÄ±ÅŸÄ±yor" });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    db: getDbStatus(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: isProduction ? "production" : "development"
  });
});

app.get("/api/admin/metrics", authMiddleware, (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, error: "forbidden" });
  }

  res.json({
    success: true,
    metrics: {
      ...getRuntimeMetrics(),
      db: getDbStatus(),
      uptime: process.uptime(),
      memoryRss: process.memoryUsage().rss
    }
  });
});

// Ä°lan detay sayfasÄ±
app.get("/ilan/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/ilan-detay.html"));
});

// Ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// index.html fallback
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  const publicDir = path.join(__dirname, "../public");
  const htmlPath = path.join(publicDir, req.path.endsWith(".html") ? req.path : req.path + ".html");

  if (htmlPath.startsWith(publicDir) && fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }

  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  if (!res.headersSent) {
    const payload = {
      success: false,
      error: "server_error"
    };
    if (!isProduction) {
      payload.debugError = err?.message || "unknown_error";
    }
    res.status(500).json(payload);
    return;
  }
  next(err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  if (isProduction) {
    gracefulShutdown("uncaughtException");
  }
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
  if (isProduction) {
    gracefulShutdown("unhandledRejection");
  }
});

process.on("SIGINT", () => {
  gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    if (!isProduction) {
      console.log("DB CONNECT OK");
    }
    server.listen(process.env.PORT || 3000, () => {
      if (!isProduction) {
        console.log("START HTTP " + (process.env.PORT || 3000));
      }
    });
  })
  .catch((err) => {
    console.error("DB CONNECT ERROR:", err);
  });
