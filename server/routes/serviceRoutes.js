import express from "express";
import { body } from "express-validator";
import { getServices, createService, updateService, deleteService } from "../controllers/serviceController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validators.js";

const router = express.Router();
router.use(protect);

router
  .route("/")
  .get(getServices)
  .post(
    [
      body("customer").notEmpty().withMessage("Customer is required"),
      body("type").notEmpty().withMessage("Service type is required"),
      body("date").notEmpty().withMessage("Service date is required"),
    ],
    validate,
    createService
  );

router.route("/:id").put(updateService).delete(authorize("admin"), deleteService);

export default router;
