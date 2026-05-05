const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  city: String,
  banned: {
    type: Boolean,
    default: false
  },
  badges: [String],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
