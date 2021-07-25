const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your username"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a  valid password"],
    minlength: 8,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
  verifyEmailToken: String,
  verifyEmailExpired: Date,
});

// Hashing Password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Checking if password entered is correct or not
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Converting user data into JSON WEB TOKEN
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpired = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return resetToken;
};

UserSchema.methods.getVerifyEmailToken = function () {
  const confirmToken = crypto.randomBytes(20).toString("hex");

  // Hash token (private key) and save to database
  this.verifyEmailToken = crypto
    .createHash("sha256")
    .update(confirmToken)
    .digest("hex");

  this.verifyEmailExpired = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return confirmToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
