/**
 * MongoDB'ye admin kullanıcı ekler veya günceller (şifre bcrypt).
 * Kullanım: MONGO_URI .env içinde tanımlı olmalı; proje kökünden: npm run seed:admin
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

var EMAIL = "admin@jetle.com";
var PASSWORD = "123456";
var NAME = "Admin";

async function main() {
  var uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI tanımlı değil. jetle-backend/.env dosyasına ekleyin.");
    process.exit(1);
  }

  var hash = await bcrypt.hash(PASSWORD, 10);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });

  var doc = await User.findOneAndUpdate(
    { email: EMAIL },
    {
      $set: {
        name: NAME,
        password: hash,
        role: "admin"
      }
    },
    { upsert: true, new: true, runValidators: true }
  );

  console.log("Admin kullanıcı hazır:", doc.email, "role:", doc.role);
  await mongoose.disconnect();
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
