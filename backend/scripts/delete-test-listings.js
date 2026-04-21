/**
 * Test ilanlarını siler. Bağlantı: MONGODB_URI (.env veya ortam değişkeni).
 * Varsayılan: tokensız POST ile oluşturulan ilanlar (anonim sahip).
 *   node backend/scripts/delete-test-listings.js
 * Tüm listings dokümanları (dikkat — production DB):
 *   node backend/scripts/delete-test-listings.js --all
 */
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { maskMongoDbUri } = require("../config/mongodbUri");
const { Listing } = require("../models/Listing");
const User = require("../models/User");

const ANONYMOUS_LISTING_OWNER_EMAIL = "anonymous.listings@jetle.internal";

async function main() {
  var uri = process.env.MONGODB_URI;
  if (!uri || String(uri).trim() === "") {
    throw new Error("MONGODB_URI tanımlı olmalı (.env veya ortam değişkeni).");
  }
  uri = String(uri).trim();
  console.log("MongoDB:", "MONGODB_URI", "|", maskMongoDbUri(uri));

  await mongoose.connect(uri);

  if (process.argv.indexOf("--all") !== -1) {
    var wipe = await Listing.deleteMany({});
    console.log("listings: silinen toplam kayıt:", wipe.deletedCount);
  } else {
    var anon = await User.findOne({ email: ANONYMOUS_LISTING_OWNER_EMAIL });
    if (!anon) {
      console.log("Anonim test kullanıcısı yok; silinecek anonim ilan yok.");
    } else {
      var r = await Listing.deleteMany({ ownerId: anon._id });
      console.log("Anonim (test) sahibe ait silinen ilan:", r.deletedCount);
    }
  }

  await mongoose.disconnect();
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
