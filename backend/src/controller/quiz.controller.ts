import { Request, Response } from "express";
import { asyncHandler } from "../utils/commonFunctions";
import quizService from "../service/quiz.service";

const quizController = {
  submitQuiz: asyncHandler(async (req: Request, res: Response) => {
    const { user_id, skill_id, answers } = req.body;

    const result = await quizService.submitQuiz(user_id, skill_id, answers);

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: result,
    });
  }),
};

export default quizController;
