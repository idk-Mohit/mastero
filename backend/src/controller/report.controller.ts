import { Request, Response } from "express";
import { asyncHandler } from "../utils/commonFunctions";
import reportService from "../service/report.service";
import { GenericResponse } from "../types/commonTypes.types";

const reportController = {
  reportsByUser: asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { filter } = req.query; // "week" | "month" | undefined

    const response: GenericResponse = await reportService.allReportsByUser(
      user_id,
      filter as string
    );

    res.status(response.statusCode ?? 200).json(response);
  }),

  allReportsAdmin: asyncHandler(async (req: Request, res: Response) => {
    const { filter } = req.query; // "week" | "month" | undefined

    const response: GenericResponse = await reportService.allReportsAdmin(
      filter as string
    );

    res.status(response.statusCode ?? 200).json(response);
  }),
  // controller/report.controller.ts
  attemptDetails: asyncHandler(async (req: Request, res: Response) => {
    const { attempt_id } = req.params;

    const response: GenericResponse = await reportService.attemptDetails(
      attempt_id
    );

    res.status(response.statusCode ?? 200).json(response);
  }),
};

export default reportController;
