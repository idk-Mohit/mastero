import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import quizController from "../controller/quiz.controller";

const router = Router();

router.post("/submit", requireAuth, quizController.submitQuiz);

export default router;
