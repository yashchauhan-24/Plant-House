import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [25, "Max 25 characters allowed"],
    minLength: [3, "Name must be at least 6 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// password hashing
// Use async middleware without the `next` callback to avoid `next is not a function`
// error that occurs when Mongoose does not provide a `next` argument to async hooks.
userSchema.pre("save", async function () {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return ; //
  }

  // hash the password with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token generate
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_KEY,
  });
};

// VERIFY paSSWord
userSchema.methods.verifyPassword = async function (userEnterPassword) {
  return await bcrypt.compare(userEnterPassword.toString(), this.password);
};
// generateResetPasswordToken
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30minute

  return resetToken;
};

// // 🔐 Hash Password
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // 🔑 Compare Password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

export default mongoose.model("User", userSchema);
