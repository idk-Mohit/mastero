import dbPool from "../config/database.config";
import { genericResponse } from "../utils/commonFunctions";

/**
 * If you want only ONE correct option per question, keep ENFORCE_SINGLE_CORRECT = true.
 * If not, set to false.
 */
const ENFORCE_SINGLE_CORRECT = true;

const optionService = {
  create: async (data: {
    question_id: number;
    label?: string;
    text: string;
    is_correct?: boolean;
  }) => {
    const conn = await dbPool.getConnection();
    try {
      await conn.beginTransaction();

      if (ENFORCE_SINGLE_CORRECT && data.is_correct) {
        await conn.query(
          "UPDATE question_options SET is_correct = 0 WHERE question_id = ?",
          [data.question_id]
        );
      }

      await conn.query(
        `INSERT INTO question_options (question_id, label, text, is_correct)
         VALUES (?, ?, ?, ?)`,
        [
          data.question_id,
          data.label || null,
          data.text,
          data.is_correct ? 1 : 0,
        ]
      );

      await conn.commit();
      return genericResponse({
        success: true,
        message: "Option created",
        statusCode: 201,
      });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      throw new Error("Failed to create option");
    } finally {
      conn.release();
    }
  },

  update: async (
    id: number,
    data: { label?: string; text?: string; is_correct?: boolean }
  ) => {
    const conn = await dbPool.getConnection();
    try {
      await conn.beginTransaction();

      // If toggling this option to correct and enforcing single-correct,
      // we need the question_id to reset others.
      if (ENFORCE_SINGLE_CORRECT && data.is_correct === true) {
        const [rows]: any = await conn.query(
          "SELECT question_id FROM question_options WHERE id = ?",
          [id]
        );
        if (rows?.length) {
          const qid = rows[0].question_id;
          await conn.query(
            "UPDATE question_options SET is_correct = 0 WHERE question_id = ?",
            [qid]
          );
        }
      }

      // Build dynamic update (simple version)
      const fields: string[] = [];
      const values: any[] = [];

      if (data.label !== undefined) {
        fields.push("label = ?");
        values.push(data.label);
      }
      if (data.text !== undefined) {
        fields.push("text = ?");
        values.push(data.text);
      }
      if (data.is_correct !== undefined) {
        fields.push("is_correct = ?");
        values.push(data.is_correct ? 1 : 0);
      }

      if (fields.length > 0) {
        values.push(id);
        await conn.query(
          `UPDATE question_options SET ${fields.join(", ")} WHERE id = ?`,
          values
        );
      }

      await conn.commit();
      return genericResponse({
        success: true,
        message: "Option updated",
        statusCode: 200,
      });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      throw new Error("Failed to update option");
    } finally {
      conn.release();
    }
  },

  remove: async (id: number) => {
    try {
      await dbPool.query("DELETE FROM question_options WHERE id = ?", [id]);
      return genericResponse({
        success: true,
        message: "Option deleted",
        statusCode: 200,
      });
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete option");
    }
  },
};

export default optionService;
