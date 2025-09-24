import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types/common.types";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { useNavigate } from "react-router";

type Q = Question & {
  options: Array<{
    id: number | string;
    text: string;
    label?: string;
  }>;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuestionCarousel({ questions }: { questions: Q[] }) {
  const { user } = useAuth();
  const { fetch } = useFetch();
  const navigate = useNavigate();

  // Shuffle options once (when questions prop changes)
  const shuffledQuestions = useMemo(() => {
    return (questions || []).map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));
  }, [questions]);

  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = shuffledQuestions[currentIndex];
  const allAnswered = Object.keys(answers).length === shuffledQuestions.length;

  const handleSelect = (questionId: number, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption, // store as string; will coerce to number on submit
    }));
  };

  const handleSubmit = async () => {
    try {
      // Coerce values to numbers for backend
      const numericAnswers: { [question_id: number]: number } = {};
      Object.entries(answers).forEach(([qid, optId]) => {
        numericAnswers[Number(qid)] = Number(optId);
      });

      const data = await fetch({
        url: "/api/quiz/submit",
        method: "POST",
        body: {
          user_id: user?.id,
          skill_id: currentQuestion.skill_id,
          answers: numericAnswers,
        },
      });

      if (data?.success) {
        navigate("/reports");
      } else {
        console.error("Submission error:", data?.message || "Unknown error");
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const goNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-8 relative">
      <Card className="shadow-sm border">
        <CardContent className="flex flex-col items-start justify-center gap-6 p-6">
          <div>
            <span className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {shuffledQuestions.length}
            </span>
            <h2 className="text-lg font-semibold mt-2">
              Q{currentQuestion.id}: {currentQuestion.text}
            </h2>
          </div>

          <RadioGroup
            name={`question-${currentQuestion.id}`}
            value={answers[currentQuestion.id] || ""}
            onValueChange={(value) =>
              handleSelect(currentQuestion.id as number, value)
            }
            className="space-y-2 w-full"
          >
            {currentQuestion.options.map((option, i) => {
              const optionIdStr = String(option.id);
              const inputId = `${currentQuestion.id}-${i}`;
              return (
                <div
                  key={optionIdStr}
                  className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent transition-all cursor-pointer"
                >
                  <RadioGroupItem value={optionIdStr} id={inputId} />
                  <Label htmlFor={inputId} className="cursor-pointer">
                    {option.label ? `${option.label}. ` : ""}
                    {option.text}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between items-center w-full mt-6">
            <Button
              variant="secondary"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={currentIndex === 0 ? "cursor-not-allowed" : ""}
            >
              Previous
            </Button>
            <Button
              variant="default"
              onClick={goNext}
              disabled={currentIndex === shuffledQuestions.length - 1}
              className={
                currentIndex === shuffledQuestions.length - 1
                  ? "cursor-not-allowed"
                  : ""
              }
            >
              Next
            </Button>
          </div>

          {allAnswered && currentIndex === shuffledQuestions.length - 1 && (
            <div className="flex justify-center w-full mt-6">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                onClick={handleSubmit}
              >
                Submit Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
