import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Skeleton } from "@/components/ui/skeleton";
import type { Question, Skill } from "@/types/common.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, AlertCircle, BookOpen, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkillSelector from "./SkillSelector";
import QuestionCarousel from "./QuestionCarousel";

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
        setSkills(response.data ?? []);
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
    <div className="min-h-screen bg-gradient-secondary">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="relative py-12 px-4 flex flex-col items-center">
          <div className="container w-full max-w-6xl">
            <Card className="glass shadow-2xl border-0 overflow-hidden animate-scale-in">
              <div className="absolute inset-0 bg-gradient-accent opacity-50"></div>
              <CardHeader className="relative text-center space-y-6 pb-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto animate-pulse-slow">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Skill Assessment
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                    Test your knowledge and track your progress. Choose a skill
                    below to begin your personalized assessment journey.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium">
                    <Target className="w-4 h-4" />
                    Personalized
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    Progress Tracking
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    Detailed Reports
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-8">
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
                {!loadingQuestions &&
                  selectedSkill &&
                  questions.length === 0 && (
                    <EmptyState message="No questions found for this skill." />
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

/* Enhanced loading component with better animations */
const QuizLoader = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Loading Questions
        </h3>
        <p className="text-sm text-muted-foreground">
          Preparing your personalized assessment...
        </p>
      </div>
    </div>

    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-slide-in-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <Skeleton className="w-full h-32 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

/* Enhanced empty state with better design */
const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-16 animate-fade-in">
    <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="h-10 w-10 text-muted-foreground" />
    </div>
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-foreground">
        No Questions Available
      </h2>
      <p className="text-muted-foreground leading-relaxed">{message}</p>
      <div className="pt-4">
        <Button
          variant="outline"
          className="border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 bg-transparent"
        >
          Try Another Skill
        </Button>
      </div>
    </div>
  </div>
);

/* Enhanced question list component */
const QuestionList = ({ questions }: { questions: Question[] }) => (
  <div className="space-y-6 animate-slide-in-up">
    <div className="text-center space-y-2">
      <h3 className="text-xl font-bold text-foreground">Ready to Begin?</h3>
      <p className="text-muted-foreground">
        You have{" "}
        <span className="font-semibold text-primary">{questions.length}</span>{" "}
        questions waiting for you
      </p>
    </div>

    <Card className="border-2 border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-30"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Assessment Questions
              </CardTitle>
              <CardDescription>
                Navigate through questions using the controls below
              </CardDescription>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {questions.length} Questions
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <QuestionCarousel questions={questions} />
      </CardContent>
    </Card>
  </div>
);
