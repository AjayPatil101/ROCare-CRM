/** 404 handler for unmatched routes — placed after all routes in server.js */
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

/**
 * Centralized error handler. Normalizes Mongoose/JWT/validation errors
 * into a consistent JSON shape: { success: false, message, errors? }
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server Error";
  let errors;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found (invalid id: ${err.value})`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = "Validation failed";
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field '${field}'`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
