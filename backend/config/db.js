const mongoose = require("mongoose");
const { env } = require("./env");

mongoose.set("strictQuery", true);

async function connectDb() {
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production"
  });
  return mongoose.connection;
}

module.exports = { connectDb, mongoose };
