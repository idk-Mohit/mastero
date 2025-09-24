import dbPool from "../config/database.config";
import { v4 as uuidv4 } from "uuid";

const quizService = {
  submitQuiz: async (
    user_id: string, // UUID now
    skill_id: string, // UUID now
    answers: { [question_id: string]: string } // question_id -> selected_option_id
  ) => {
    try {
      const questionIds = Object.keys(answers);

      // Get correct options for these questions
      const [rows]: any[] = await dbPool.query(
        `SELECT id AS option_id, question_id, is_correct
         FROM question_options
         WHERE question_id IN (?)`,
        [questionIds]
      );

      const correctMap: Record<string, string> = {}; // question_id => correct_option_id
      rows.forEach((opt: any) => {
        if (opt.is_correct) {
          correctMap[opt.question_id] = opt.option_id;
        }
      });

      const now = new Date();
      const attempt_id = uuidv4(); // generate UUID for attempt

      // Step 1: Insert into quiz_attempts
      await dbPool.query(
        `INSERT INTO quiz_attempts 
          (id, user_id, quiz_id, started_at, completed_at, score_pct)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [attempt_id, user_id, skill_id, now, now, 0]
      );

      let correctCount = 0;
      const totalQuestions = questionIds.length;

      const answerRecords = questionIds.map((qid) => {
        const selected = answers[qid];
        const correct = correctMap[qid];
        const isCorrect = selected === correct;
        if (isCorrect) correctCount++;

        return [uuidv4(), attempt_id, qid, selected, isCorrect, now]; // each answer also gets UUID id
      });

      // Step 2: Bulk insert into quiz_answers
      await dbPool.query(
        `INSERT INTO quiz_answers 
          (id, attempt_id, question_id, selected_option_id, is_correct, answered_at)
         VALUES ?`,
        [answerRecords]
      );

      const score_pct = parseFloat(
        ((correctCount / totalQuestions) * 100).toFixed(2)
      );

      // Step 3: Update score in quiz_attempts
      await dbPool.query(
        `UPDATE quiz_attempts SET score_pct = ? WHERE id = ?`,
        [score_pct, attempt_id]
      );

      // Return the breakdown
      const breakdown = questionIds.map((qid) => ({
        question_id: qid,
        selected_option_id: answers[qid],
        correct_option_id: correctMap[qid],
        is_correct: answers[qid] === correctMap[qid],
      }));

      return { attempt_id, score_pct, breakdown };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to submit quiz");
    }
  },
};

export default quizService;
