import express from "express";
import { body } from "express-validator";
import {
  registerUser, loginUser, getMe, forgotPassword,
  resetPassword, updateMe, changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validators.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  registerUser
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  loginUser
);

router.post("/forgot-password", [body("email").isEmail()], validate, forgotPassword);
router.post(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 })],
  validate,
  resetPassword
);

router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("avatar"), updateMe);
router.put(
  "/change-password",
  protect,
  [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 6 })],
  validate,
  changePassword
);

export default router;
