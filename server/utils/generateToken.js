import jwt from "jsonwebtoken";

/** Generates a signed JWT access token for a given user id. */
export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

/** Generates a short-lived JWT used only for password-reset links. */
export const generateResetToken = (id) =>
  jwt.sign({ id }, process.env.JWT_RESET_SECRET, {
    expiresIn: process.env.JWT_RESET_EXPIRES_IN || "15m",
  });
