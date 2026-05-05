const express = require("express");
const router = express.Router();
const CarBrand = require("../models/CarBrand");

router.get("/", async (req, res) => {
  try {
    const brands = await CarBrand.find().sort({ name: 1 });
    res.json(brands);
  } catch (err) {
    console.error("CARS ERROR:", err);
    res.status(500).json({ error: "Araç verisi alınamadı" });
  }
});

module.exports = router;
