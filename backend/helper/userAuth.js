import ErrorHandler from "../helper/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const verifyToken = async (req, res, next) => {
  const token = req.cookies;
  console.log("Token:", token);
  if (!token || !token.token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decodeedData = jwt.verify(token.token, process.env.JWT_SECRET);
  console.log("Decoded Data:", decodeedData);
  req.user = await User.findById(decodeedData.id);
  //   console.log(req.user);
  next();
};

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
