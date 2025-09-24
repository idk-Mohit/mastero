import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import optionController from "../controller/option.controller";

const router = Router();

// create option
router.post("/", requireAuth, optionController.create);

// update option
router.put("/:id", requireAuth, optionController.update);

// delete option
router.delete("/:id", requireAuth, optionController.remove);

export default router;
