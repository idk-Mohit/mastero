import { Request, Response } from "express";
import questionService from "../service/question.service";
import { GenericResponse } from "../types/commonTypes.types";
import { asyncHandler } from "../utils/commonFunctions";

const questionController = {
  getQuestionsBySkillId: asyncHandler(async (req: Request, res: Response) => {
    const { skill_id } = req.query;
    const response: GenericResponse =
      await questionService.getQuestionsBySkillId(Number(skill_id));
    res.status(response.statusCode ?? 200).json(response);
  }),

  getQuestionWithOptionsBySkillId: asyncHandler(
    async (req: Request, res: Response) => {
      const { skill_id } = req.query;
      const response: GenericResponse =
        await questionService.getQuestionWithOptionsBySkillId(Number(skill_id));
      res.status(response.statusCode ?? 200).json(response);
    }
  ),

  addQuestion: asyncHandler(async (req: Request, res: Response) => {
    const { text, skill_id, difficulty } = req.body;
    const response: GenericResponse = await questionService.addQuestion({
      text,
      skill_id,
      difficulty,
    });
    res.status(response.statusCode ?? 201).json(response);
  }),

  deleteQuestion: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response: GenericResponse = await questionService.deleteQuestion(
      Number(id)
    );
    res.status(response.statusCode ?? 200).json(response);
  }),
};

export default questionController;
