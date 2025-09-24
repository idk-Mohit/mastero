import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import questionController from "../controller/question.controller";

const router = Router();

router.get("/", requireAuth, questionController.getQuestionsBySkillId);
router.get(
  "/questionWithOptions",
  requireAuth,
  questionController.getQuestionWithOptionsBySkillId
);
router.post("/", requireAuth, questionController.addQuestion);
router.delete("/:id", requireAuth, questionController.deleteQuestion);

export default router;
