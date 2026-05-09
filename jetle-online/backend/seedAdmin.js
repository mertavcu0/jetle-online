require("dotenv").config({ path: __dirname + "/.env" });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = "babacandir@gmail.com";
const ADMIN_PASSWORD = "Jetle3080";

async function seedAdmin() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(MONGO_URI);

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

  await User.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        name: "Admin",
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin",
        banned: false
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  console.log("ADMIN SEEDED");
}

seedAdmin()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
    } catch (_) {
      // ignore close errors during shutdown
    }
  });
