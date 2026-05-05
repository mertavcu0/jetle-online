require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const listingsRoutes = require("./routes/listings");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");
const carsRoute = require("./routes/cars");
const Listing = require("./models/Listing");
const authMiddleware = require("./middleware/auth");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

console.log("SERVER BAŞLADI");
console.log("SERVER DOSYASI:", __filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cars", carsRoute);

app.get("/api/my-listings", authMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id, isDeleted: false });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/test-auth", (req, res) => {
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API çalışıyor" });
});

// İlan detay sayfası
app.get("/ilan/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/ilan-detay.html"));
});

// Ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// index.html fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Server error" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo bağlandı");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on http://localhost:" + (process.env.PORT || 3000));
    });
  })
  .catch((err) => {
    console.error("Mongo hata:", err);
  });
