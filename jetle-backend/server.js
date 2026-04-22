require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is required in .env");
    process.exit(1);
  }

  await connectDB();

  var app = express();
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.static(path.join(__dirname, "../jetle-v2")));

  app.get("/health", function (req, res) {
    res.json({ ok: true, service: "jetle-backend" });
  });

  app.use("/api", require("./routes"));

  app.use(function (req, res) {
    res.status(404).json({ ok: false, message: "Not found" });
  });

  app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Sunucu hatası." });
  });

  var port = Number(process.env.PORT) || 5000;
  app.listen(port, function () {
    console.log("jetle-backend listening on port " + port);
  });
}

start().catch(function (e) {
  console.error(e);
  process.exit(1);
});
