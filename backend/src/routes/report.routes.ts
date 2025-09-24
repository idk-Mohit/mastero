import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import reportController from "../controller/report.controller";

const router = Router();

// User specific reports with optional time filter
router.get("/user/:user_id", requireAuth, reportController.reportsByUser);

// Admin: fetch all users’ reports with optional filter
router.get("/all", requireAuth, reportController.allReportsAdmin);
// routes/report.routes.ts
router.get(
  "/attempt/:attempt_id",
  requireAuth,
  reportController.attemptDetails
);

export default router;
