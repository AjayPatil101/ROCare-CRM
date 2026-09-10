import express from "express";
import { body } from "express-validator";
import {
  submitContact, getContactMessages, updateContactMessage, deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validators.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("message").trim().notEmpty(),
  ],
  validate,
  submitContact
);

router.get("/", protect, authorize("admin"), getContactMessages);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateContactMessage)
  .delete(protect, authorize("admin"), deleteContactMessage);

export default router;
