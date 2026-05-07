const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const ADMIN_EMAIL = "babacan@gmail.com";
const ADMIN_PASSWORD = "Jetle3080";

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI tanımlı değil");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });

    if (existingUser) {
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      existingUser.banned = false;

      if (!existingUser.name) {
        existingUser.name = "Admin";
      }

      await existingUser.save();

      console.log("Admin kullanıcı güncellendi:");
      console.log(`- email: ${existingUser.email}`);
      console.log(`- role: ${existingUser.role}`);
    } else {
      const adminUser = await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        city: "",
        role: "admin",
        banned: false
      });

      console.log("Admin kullanıcı oluşturuldu:");
      console.log(`- email: ${adminUser.email}`);
      console.log(`- role: ${adminUser.role}`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("SEED ADMIN ERROR:", err.message);
    process.exitCode = 1;
    try {
      await mongoose.disconnect();
    } catch (_) {
      // noop
    }
  }
}

run();
