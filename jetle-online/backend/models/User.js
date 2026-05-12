const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: ""
  },
  username: {
    type: String,
    trim: true,
    default: ""
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    trim: true,
    default: ""
  },
  district: {
    type: String,
    trim: true,
    default: ""
  },
  phone: {
    type: String,
    trim: true,
    default: ""
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBadge: {
    type: Boolean,
    default: false
  },
  banned: {
    type: Boolean,
    default: false
  },
  badges: {
    type: [String],
    default: []
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
