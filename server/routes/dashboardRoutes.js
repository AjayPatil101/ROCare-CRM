import express from "express";
import { getDashboardStats, getEarningsReport } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/earnings-report", getEarningsReport);

export default router;
