import { validationResult } from "express-validator";

/**
 * Runs after express-validator chains on a route; returns 400 with a
 * structured error list if any validation rule failed.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
