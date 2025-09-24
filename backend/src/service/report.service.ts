import dbPool from "../config/database.config";
import { genericResponse } from "../utils/commonFunctions";

function buildDateFilter(filter?: string) {
  if (filter === "week") {
    return "AND started_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
  }
  if (filter === "month") {
    return "AND started_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  }
  return "";
}

const reportService = {
  allReportsByUser: async (user_id: string, filter?: string) => {
    try {
      const dateFilter = buildDateFilter(filter);

      const [attempts]: any[] = await dbPool.query(
        `SELECT id, quiz_id, started_at, completed_at, score_pct
         FROM quiz_attempts
         WHERE user_id = ? ${dateFilter}
         ORDER BY started_at DESC`,
        [user_id]
      );

      if (!attempts.length) {
        return genericResponse({
          success: true,
          message: "No attempts found for this user",
          data: { user_id, attempts: [] },
          statusCode: 200,
        });
      }

      const attemptIds = attempts.map((a: { id: string }) => a.id);
      const [answers]: any[] = await dbPool.query(
        `SELECT attempt_id, question_id, selected_option_id, is_correct, answered_at
         FROM quiz_answers
         WHERE attempt_id IN (?)`,
        [attemptIds]
      );

      const answersByAttempt: Record<string, any[]> = {};
      answers.forEach((ans: any) => {
        if (!answersByAttempt[ans.attempt_id]) {
          answersByAttempt[ans.attempt_id] = [];
        }
        answersByAttempt[ans.attempt_id].push(ans);
      });

      const report = attempts.map((attempt: any) => ({
        ...attempt,
        answers: answersByAttempt[attempt.id] || [],
      }));

      return genericResponse({
        success: true,
        message: "User reports fetched successfully",
        data: { user_id, attempts: report },
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch user reports");
    }
  },

  allReportsAdmin: async (filter?: string) => {
    try {
      const dateFilter = buildDateFilter(filter);

      const [attempts]: any[] = await dbPool.query(
        `SELECT qa.id, qa.user_id, qa.quiz_id, qa.started_at, qa.completed_at, qa.score_pct, u.email
         FROM quiz_attempts qa
         JOIN users u ON qa.user_id = u.id
         WHERE 1=1 ${dateFilter}
         ORDER BY qa.started_at DESC`
      );

      return genericResponse({
        success: true,
        message: "All user reports fetched successfully",
        data: attempts,
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch admin reports");
    }
  },
  // service/report.service.ts
  attemptDetails: async (attempt_id: string) => {
    try {
      // 1. Get attempt info
      const [attempts]: any[] = await dbPool.query(
        `SELECT id, user_id, quiz_id, started_at, completed_at, score_pct
       FROM quiz_attempts
       WHERE id = ?`,
        [attempt_id]
      );

      if (!attempts.length) {
        return genericResponse({
          success: false,
          message: "Attempt not found",
          statusCode: 404,
        });
      }

      // 2. Get answers with question + options
      const [answers]: any[] = await dbPool.query(
        `SELECT 
          qa.id as answer_id,
          qa.question_id,
          q.text as question_text,
          qa.selected_option_id,
          qa.is_correct,
          qa.answered_at,
          qo.id as option_id,
          qo.label as option_label,
          qo.text as option_text,
          qo.is_correct as option_is_correct
       FROM quiz_answers qa
       JOIN questions q ON qa.question_id = q.id
       JOIN question_options qo ON qo.question_id = q.id
       WHERE qa.attempt_id = ?
       ORDER BY qa.question_id, qo.label`,
        [attempt_id]
      );

      // 3. Group answers by question
      const questionsMap: any = {};
      answers.forEach((row: any) => {
        if (!questionsMap[row.question_id]) {
          questionsMap[row.question_id] = {
            question_id: row.question_id,
            text: row.question_text,
            selected_option_id: row.selected_option_id,
            is_correct: row.is_correct,
            answered_at: row.answered_at,
            options: [],
          };
        }

        questionsMap[row.question_id].options.push({
          id: row.option_id,
          label: row.option_label,
          text: row.option_text,
          is_correct: row.option_is_correct,
        });
      });

      return genericResponse({
        success: true,
        message: "Attempt details fetched successfully",
        data: {
          ...attempts[0],
          questions: Object.values(questionsMap),
        },
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch attempt details");
    }
  },
};

export default reportService;
