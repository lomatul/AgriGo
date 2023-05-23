const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { boolean } = require("joi");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
  },
  
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
  },
  
  companyName: {
    type: String,
    default: "N/A",
  },

  img: {
    type: String,
    default: null,
    // required: [true, "Please provide username"],
  },

  email: {
    type: String,
    required: [true, "Please provide email address"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isSeller: {
    type: Boolean,
    // default: false,
    required: [true, "Please provide type of user - buyer or seller"],
  },
  desc: {
    type: String,
    required: false,
    default: "N/A",
  },
  phone: {
    type: String,
    required: true,
    default: "N/A",
  },
  country: {
    type: String,
    required: true,
    default: "N/A",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  hasCompletedRegistration: {
    type: Boolean,
    default: false,
    required: true,
  },
},{
  timestamps: true
});


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return resetToken;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
