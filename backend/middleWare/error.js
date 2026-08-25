import ErrorHandler from "../helper/errorHandler.js";
export default async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //dupolicate key error
  if (err.code === 11000) {
    const message = `this ${Object.keys(err.keyValue)} already exists`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
