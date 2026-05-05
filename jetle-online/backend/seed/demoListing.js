const mongoose = require("mongoose");
require("dotenv").config();

const Listing = require("../models/Listing");

mongoose.connect(process.env.MONGO_URI);

async function run() {
  await Listing.deleteMany({ title: "DEMO İLAN" });

  await Listing.create({
    title: "DEMO İLAN",
    price: 1250000,
    city: "İstanbul",
    district: "Kadıköy",
    category: "vasita",
    subcategory: "otomobil",
    description: "Bu ilan sadece demo amaçlıdır.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a",
      "https://images.unsplash.com/photo-1549924231-f129b911e442"
    ],
    views: 12,
    isFeatured: true,
    isBoosted: true
  });

  console.log("DEMO ilan eklendi");
  process.exit();
}

run();
