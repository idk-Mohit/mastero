import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types/common.types";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  BarChart3,
  Clock,
} from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = shuffledQuestions[currentIndex];
  const allAnswered = Object.keys(answers).length === shuffledQuestions.length;
  const currentAnswered =
    currentQuestion && answers[currentQuestion.id as number];

  const handleSelect = (questionId: number, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Question {currentIndex + 1} of {shuffledQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-primary font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>{Object.keys(answers).length} answered</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{
              width: `${
                ((currentIndex + 1) / shuffledQuestions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <Card className="shadow-2xl border-2 border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden animate-scale-in">
        <div className="absolute inset-0 bg-gradient-accent opacity-20"></div>
        <CardContent className="relative p-8 space-y-8">
          {/* Question header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center font-bold text-white">
                {currentIndex + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>
              {currentAnswered && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Answered
                </div>
              )}
            </div>
          </div>

          <RadioGroup
            name={`question-${currentQuestion.id}`}
            value={answers[currentQuestion.id as number] || ""}
            onValueChange={(value) =>
              handleSelect(currentQuestion.id as number, value)
            }
            className="space-y-3"
          >
            {currentQuestion.options.map((option, i) => {
              const optionIdStr = String(option.id);
              const inputId = `${currentQuestion.id}-${i}`;
              const isSelected =
                answers[currentQuestion.id as number] === optionIdStr;

              return (
                <div
                  key={optionIdStr}
                  className={`group relative animate-slide-in-right transition-all duration-300 ${
                    isSelected
                      ? "bg-primary/10 border-primary/30 shadow-lg scale-[1.02]"
                      : "bg-card/50 border-border hover:border-primary/30 hover:bg-primary/5"
                  } flex items-center space-x-4 rounded-xl border-2 p-4 cursor-pointer`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={optionIdStr}
                      id={inputId}
                      className={`w-5 h-5 ${
                        isSelected ? "border-primary text-primary" : ""
                      }`}
                    />
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-colors ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                      }`}
                    >
                      {option.label || String.fromCharCode(65 + i)}
                    </div>
                  </div>
                  <Label
                    htmlFor={inputId}
                    className={`flex-1 cursor-pointer font-medium leading-relaxed transition-colors ${
                      isSelected
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {option.text}
                  </Label>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary animate-scale-in" />
                  )}
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between items-center pt-6 border-t border-border/50">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={`h-12 px-6 border-2 transition-all duration-300 ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-primary hover:bg-primary hover:text-white"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {shuffledQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary scale-125"
                      : answers[shuffledQuestions[index].id as number]
                      ? "bg-green-500"
                      : "bg-muted hover:bg-primary/30"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="default"
              onClick={goNext}
              disabled={currentIndex === shuffledQuestions.length - 1}
              className={`h-12 px-6 bg-gradient-primary hover:opacity-90 transition-all duration-300 ${
                currentIndex === shuffledQuestions.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {allAnswered && currentIndex === shuffledQuestions.length - 1 && (
            <div className="text-center space-y-4 pt-6 border-t border-border/50 animate-slide-in-up">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">
                  Ready to Submit?
                </h3>
                <p className="text-muted-foreground">
                  You've answered all questions. Submit to see your results and
                  detailed analysis.
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="h-14 px-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                    Submit Assessment
                    <BarChart3 className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
