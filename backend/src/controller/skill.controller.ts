import { Request, Response } from "express";
import skillService from "../service/skill.service";
import { GenericResponse } from "../types/commonTypes.types";
import { asyncHandler } from "../utils/commonFunctions";

const skillController = {
  getAllSkills: asyncHandler(async (req: Request, res: Response) => {
    const response: GenericResponse = await skillService.getSkills();
    res.status(response.statusCode ?? 200).json(response);
  }),

  addSkill: asyncHandler(async (req: Request, res: Response) => {
    const { name, description, is_active } = req.body;
    const response: GenericResponse = await skillService.addSkill({
      name,
      description,
      is_active,
    });
    res.status(response.statusCode ?? 200).json(response);
  }),

  updateSkill: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, is_active } = req.body;
    const response: GenericResponse = await skillService.updateSkill(id, {
      name,
      description,
      is_active,
    });
    res.status(response.statusCode ?? 200).json(response);
  }),

  deleteSkill: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response: GenericResponse = await skillService.deleteSkill(id);
    res.status(response.statusCode ?? 200).json(response);
  }),
};

export default skillController;
