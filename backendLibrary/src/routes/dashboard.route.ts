import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/stats", dashboardController.getDashboardStats);

router.get("/recent-activities", dashboardController.getRecentActivities);

router.get("/monthly-checkouts", dashboardController.getMonthlyCheckouts);

router.get("/popular-genres", dashboardController.getPopularGenres);

export default router;