const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  }],
  notifications: [{
    text: String,
    link: String,
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
