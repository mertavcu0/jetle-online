const mongoose = require("mongoose");

const ALLOWED_ROLES = ["user", "admin", "moderator"];

function normalizeUserRole(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  return normalized || "user";
}

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
  googleId: {
    type: String,
    trim: true,
    default: "",
    index: true
  },
  authProvider: {
    type: String,
    trim: true,
    default: "local"
  },
  avatarUrl: {
    type: String,
    trim: true,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  resetPasswordToken: {
    type: String,
    default: ""
  },
  resetPasswordExpire: {
    type: Date,
    default: null
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
    enum: ALLOWED_ROLES,
    set: normalizeUserRole,
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

function normalizeRoleUpdate(update) {
  if (!update || typeof update !== "object") return;

  if (Object.prototype.hasOwnProperty.call(update, "role")) {
    update.role = normalizeUserRole(update.role);
  }

  if (update.$set && Object.prototype.hasOwnProperty.call(update.$set, "role")) {
    update.$set.role = normalizeUserRole(update.$set.role);
  }

  if (update.$setOnInsert && Object.prototype.hasOwnProperty.call(update.$setOnInsert, "role")) {
    update.$setOnInsert.role = normalizeUserRole(update.$setOnInsert.role);
  }
}

userSchema.pre("validate", function normalizeRoleBeforeValidate(next) {
  this.role = normalizeUserRole(this.role);
  next();
});

userSchema.pre("save", function normalizeRoleBeforeSave(next) {
  this.role = normalizeUserRole(this.role);
  next();
});

userSchema.pre("updateOne", function normalizeRoleInUpdateOne(next) {
  normalizeRoleUpdate(this.getUpdate());
  next();
});

userSchema.pre("updateMany", function normalizeRoleInUpdateMany(next) {
  normalizeRoleUpdate(this.getUpdate());
  next();
});

userSchema.pre("findOneAndUpdate", function normalizeRoleInFindOneAndUpdate(next) {
  normalizeRoleUpdate(this.getUpdate());
  next();
});

userSchema.statics.normalizeUserRole = normalizeUserRole;

module.exports = mongoose.model("User", userSchema);
