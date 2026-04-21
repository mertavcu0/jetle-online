const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

function connectDb() {
  var uri = process.env.MONGODB_URI;
  if (uri == null || String(uri).trim() === "") {
    return Promise.reject(new Error("Missing MONGODB_URI"));
  }
  return mongoose
    .connect(String(uri).trim(), {
      autoIndex: process.env.NODE_ENV !== "production"
    })
    .then(function () {
      console.log("MongoDB Connected");
      return mongoose.connection;
    })
    .catch(function (err) {
      console.error("MongoDB Error:", err);
      throw err;
    });
}

module.exports = { connectDb, mongoose };
