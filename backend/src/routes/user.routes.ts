import { Router } from "express";
import authController from "../controller/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
