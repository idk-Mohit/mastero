import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Skeleton } from "@/components/ui/skeleton";
import type { Question, Skill } from "@/types/common.types";
import QuestionCarousel from "./QuestionCarousel";
import SkillSelector from "./SkillSelector";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Quiz = () => {
  const { fetch } = useFetch();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Load Skills
  useEffect(() => {
    const getSkills = async () => {
      try {
        const response = await fetch({ url: "/api/skills", method: "GET" });
        setSkills(response.data);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoadingSkills(false);
      }
    };
    getSkills();
  }, []);

  // Load Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedSkill) return;
      setLoadingQuestions(true);
      try {
        const res = await fetch({
          url: `/api/questions/questionWithOptions?skill_id=${selectedSkill}`,
          method: "GET",
        });
        setQuestions(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [selectedSkill]);

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center bg-background">
      <Card className="container w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Take a Quiz</CardTitle>
          <CardDescription>
            Choose a skill and test your knowledge. Your progress will be saved
            in reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skill Selector */}
          <SkillSelector
            skills={skills}
            loading={loadingSkills}
            onChange={(val) => setSelectedSkill(val)}
          />

          {/* Loading state */}
          {loadingQuestions && <QuizLoader />}

          {/* Questions */}
          {!loadingQuestions && questions.length > 0 && (
            <QuestionList questions={questions} />
          )}

          {/* Empty state */}
          {!loadingQuestions && selectedSkill && questions.length === 0 && (
            <EmptyState message="No questions found for this skill." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;

const QuizLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="w-full h-24 rounded-lg" />
    ))}
    <div className="flex justify-center mt-4">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
    <p className="text-muted-foreground mb-4">{message}</p>
    <Button variant="secondary">Try Another Skill</Button>
  </div>
);

const QuestionList = ({ questions }: { questions: Question[] }) => (
  <div className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Questions ({questions.length})
        </CardTitle>
        <CardDescription>
          Swipe or use arrows to move through the quiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QuestionCarousel questions={questions} />
      </CardContent>
    </Card>
  </div>
);
