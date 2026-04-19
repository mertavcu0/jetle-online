require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const listingsRouter = require("./routes/listings");

const PORT = Number(process.env.PORT) || 8080;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Hata: MONGO_URI .env dosyasında tanımlı olmalı.");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", function root(req, res) {
  res.type("text/plain; charset=utf-8").send("API çalışıyor");
});

app.use("/api/listings", listingsRouter);

app.use(function notFound(req, res) {
  res.status(404).json({ ok: false, message: "Not found" });
});

app.use(function errHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ ok: false, message: err.message || "Sunucu hatası" });
});

mongoose
  .connect(MONGO_URI)
  .then(function () {
    app.listen(PORT, function () {
      console.log("Sunucu:", PORT, "| MongoDB bağlı");
    });
  })
  .catch(function (err) {
    console.error("MongoDB bağlantı hatası:", err.message);
    process.exit(1);
  });
