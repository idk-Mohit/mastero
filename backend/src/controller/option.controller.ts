import { Request, Response } from "express";
import { asyncHandler } from "../utils/commonFunctions";
import { GenericResponse } from "../types/commonTypes.types";
import optionService from "../service/option.service";

const optionController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const { question_id, label, text, is_correct } = req.body;
    const response: GenericResponse = await optionService.create({
      question_id,
      label,
      text,
      is_correct: !!is_correct,
    });
    res.status(response.statusCode ?? 201).json(response);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { label, text, is_correct } = req.body;
    const response: GenericResponse = await optionService.update(Number(id), {
      label,
      text,
      is_correct,
    });
    res.status(response.statusCode ?? 200).json(response);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response: GenericResponse = await optionService.remove(Number(id));
    res.status(response.statusCode ?? 200).json(response);
  }),
};

export default optionController;
