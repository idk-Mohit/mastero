import { Router } from "express";
import AuthRouter from "./auth.routes";
import UserRouter from "./user.routes";
import SkillRouter from "./skill.routes";
import QuestionRouter from "./question.routes";
import QuizRouter from "./quiz.routes";
import ReportRouter from "./report.routes";
import OptionsRouter from "./option.routes";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/skills", SkillRouter);
router.use("/questions", QuestionRouter);
router.use("/options", OptionsRouter);
router.use("/quiz", QuizRouter);
router.use("/report", ReportRouter);

export default router;
