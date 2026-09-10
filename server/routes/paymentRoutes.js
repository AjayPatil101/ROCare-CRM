import express from "express";
import { getPayments, createPayment, updatePayment, deletePayment } from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getPayments).post(createPayment);
router.route("/:id").put(updatePayment).delete(authorize("admin"), deletePayment);

export default router;
