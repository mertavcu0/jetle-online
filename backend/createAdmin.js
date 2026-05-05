const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://127.0.0.1:27017/jetle");

async function createAdmin() {
  const hashed = await bcrypt.hash("123456", 10);

  await Admin.create({
    username: "admin",
    password: hashed,
  });

  console.log("Admin oluşturuldu");
  process.exit();
}

createAdmin();
