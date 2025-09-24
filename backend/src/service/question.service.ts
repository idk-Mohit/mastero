import dbPool from "../config/database.config";
import { genericResponse } from "../utils/commonFunctions";

const questionService = {
  getQuestionsBySkillId: async (skill_id: number) => {
    try {
      const query = "SELECT * FROM questions WHERE skill_id = ?";
      const [result]: any = await dbPool.query(query, [skill_id]);

      if (!result || result.length === 0) {
        return genericResponse({
          message: "No questions found",
          statusCode: 404,
        });
      }

      return genericResponse({
        success: true,
        message: "Questions found",
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get questions");
    }
  },

  getQuestionWithOptionsBySkillId: async (skill_id: number) => {
    try {
      const query = `
        SELECT 
          q.id AS question_id,
          q.text AS question_text,
          q.skill_id,
          q.difficulty,
          o.id AS option_id,
          o.label AS option_label,
          o.text AS option_text,
          o.is_correct
        FROM questions q
        LEFT JOIN question_options o ON o.question_id = q.id
        WHERE q.skill_id = ?
        ORDER BY q.id, o.label
      `;

      const [result]: any = await dbPool.query(query, [skill_id]);

      if (!result || result.length === 0) {
        return genericResponse({
          message: "No questions found",
          statusCode: 404,
        });
      }

      const questionsMap: Record<number, any> = {};
      result.forEach((row: any) => {
        if (!questionsMap[row.question_id]) {
          questionsMap[row.question_id] = {
            id: row.question_id,
            text: row.question_text,
            skill_id: row.skill_id,
            difficulty: row.difficulty,
            options: [],
          };
        }
        if (row.option_id) {
          questionsMap[row.question_id].options.push({
            id: row.option_id,
            label: row.option_label,
            text: row.option_text,
            is_correct: row.is_correct,
          });
        }
      });

      return genericResponse({
        success: true,
        message: "Questions with options retrieved",
        data: Object.values(questionsMap),
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in getQuestionWithOptionsBySkillId:", error);
      throw new Error("Failed to get questions with options");
    }
  },

  addQuestion: async (data: {
    text: string;
    skill_id: number;
    difficulty?: string;
  }) => {
    try {
      const query =
        "INSERT INTO questions (text, skill_id, difficulty) VALUES (?, ?, ?)";
      await dbPool.query(query, [
        data.text,
        data.skill_id,
        data.difficulty || null,
      ]);

      return genericResponse({
        success: true,
        message: "Question added successfully",
        statusCode: 201,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add question");
    }
  },

  deleteQuestion: async (id: number) => {
    try {
      await dbPool.query("DELETE FROM questions WHERE id = ?", [id]);

      return genericResponse({
        success: true,
        message: "Question deleted successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete question");
    }
  },
};

export default questionService;
