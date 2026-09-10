import express from "express";
import { body } from "express-validator";
import {
  getCustomers, getCustomer, createCustomer,
  updateCustomer, deleteCustomer, getReminders,
} from "../controllers/customerController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validators.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.use(protect);

const customerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("installDate").notEmpty().withMessage("Installation date is required"),
];

router.get("/reminders/:range", getReminders);
router
  .route("/")
  .get(getCustomers)
  .post(upload.single("photo"), customerValidation, validate, createCustomer);

router
  .route("/:id")
  .get(getCustomer)
  .put(upload.single("photo"), updateCustomer)
  .delete(authorize("admin"), deleteCustomer);

export default router;
