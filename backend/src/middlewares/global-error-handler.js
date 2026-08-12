import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Invalid MongoDB ObjectId
  if (err instanceof mongoose.Error.CastError) {
    error.statusCode = 400;
    error.message = "Invalid resource ID.";
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.statusCode = 409;
    error.message = `${field} already exists.`;
  }

  // JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    error.statusCode = 401;
    error.message = "Invalid authentication token.";
  }

  if (err instanceof jwt.TokenExpiredError) {
    error.statusCode = 401;
    error.message = "Authentication token has expired.";
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default globalErrorHandler;