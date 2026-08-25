import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [30, "Name cannot exceed 30 characters"],
      minlength: [4, "Name should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should have at least 6 characters"],
      select: false, // This will prevent the password from being returned in queries by default
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetpasswordToken: String,
    resetpasswordExpire: Date,
  },

  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});
// this is creating jwt token and returning it
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getforgetpasswordToken = function () {
  // generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // generating hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // setting expiry time
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  this.resetpasswordToken = resetPasswordToken;
  this.resetpasswordExpire = resetPasswordExpire;

  return resetToken;
};
export default mongoose.model("User", userSchema);
