import dbPool from "../config/database.config";
import { randomUUID } from "node:crypto";

type AnswersMap = { [question_id: string]: string };

const quizService = {
  submitQuiz: async (
    user_id: string, // UUID
    skill_id: string, // UUID (your "quiz_id")
    answers: AnswersMap // question_id -> selected_option_id
  ) => {
    if (!answers || Object.keys(answers).length === 0) {
      throw new Error("No answers provided");
    }

    const conn = await dbPool.getConnection();
    try {
      await conn.beginTransaction();

      const questionIds = Object.keys(answers);

      // Fetch correct options for the provided questions
      const [rows]: any[] = await conn.query(
        `
          SELECT id AS option_id, question_id, is_correct
          FROM question_options
          WHERE question_id IN (?)
        `,
        [questionIds]
      );

      const correctMap: Record<string, string> = {};
      for (const opt of rows as Array<{
        option_id: string;
        question_id: string;
        is_correct: number;
      }>) {
        if (opt.is_correct) correctMap[opt.question_id] = String(opt.option_id);
      }

      const now = new Date();
      const attempt_id = randomUUID();

      // 1) Insert attempt
      await conn.query(
        `
          INSERT INTO quiz_attempts
            (id, user_id, quiz_id, started_at, completed_at, score_pct)
          VALUES
            (?,  ?,       ?,      ?,          ?,            ?)
        `,
        [attempt_id, user_id, skill_id, now, now, 0]
      );

      // 2) Build answers and count correct
      let correctCount = 0;
      const totalQuestions = questionIds.length;

      const answerRecords = questionIds.map((qid) => {
        const selected = answers[qid];
        const correct = correctMap[qid];
        const isCorrect = selected === correct ? 1 : 0; // TINYINT(1)

        if (isCorrect) correctCount++;

        return [
          randomUUID(),
          attempt_id,
          qid,
          selected ?? null,
          isCorrect,
          now,
        ];
      });

      // 3) Bulk insert answers
      await conn.query(
        `
          INSERT INTO quiz_answers
            (id, attempt_id, question_id, selected_option_id, is_correct, answered_at)
          VALUES ?
        `,
        [answerRecords]
      );

      // 4) Update attempt score
      const score_pct = Number(
        ((correctCount / totalQuestions) * 100).toFixed(2)
      );
      await conn.query(`UPDATE quiz_attempts SET score_pct = ? WHERE id = ?`, [
        score_pct,
        attempt_id,
      ]);

      await conn.commit();

      const breakdown = questionIds.map((qid) => ({
        question_id: qid,
        selected_option_id: answers[qid],
        correct_option_id: correctMap[qid] ?? null,
        is_correct: (answers[qid] ?? null) === (correctMap[qid] ?? undefined),
      }));

      return { attempt_id, score_pct, breakdown };
    } catch (err) {
      await conn.rollback();
      console.error(err);
      throw new Error("Failed to submit quiz");
    } finally {
      conn.release();
    }
  },
};

export default quizService;
