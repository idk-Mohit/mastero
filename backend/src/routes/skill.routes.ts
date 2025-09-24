import { Router } from "express";
import skillController from "../controller/skill.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, skillController.getAllSkills);
router.post("/", requireAuth, skillController.addSkill);
router.put("/:id", requireAuth, skillController.updateSkill);
router.delete("/:id", requireAuth, skillController.deleteSkill);

export default router;
