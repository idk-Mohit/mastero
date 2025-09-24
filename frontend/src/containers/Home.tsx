import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";
import {
  BarChart3,
  Settings,
  Users,
  ArrowRight,
  Trophy,
  Target,
  Brain,
  Shield,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="relative py-16 px-4 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-8">
            <div className="text-center space-y-4 animate-slide-in-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Trophy className="w-4 h-4" />
                Welcome back, learner!
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                Hello{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {user?.email?.split("@")[0] || "User"}
                </span>
                !
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Ready to challenge yourself and expand your knowledge? Let's
                continue your learning journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {!isAdmin && (
                <>
                  <Card
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm animate-slide-in-up overflow-hidden"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative space-y-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        Take a Quiz
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative flex flex-col gap-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Challenge yourself with skill-based assessments. Track
                        your progress and identify areas for improvement.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Target className="w-4 h-4" />
                        Personalized learning path
                      </div>
                      <Button
                        onClick={() => navigate("/quiz")}
                        className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 group/btn"
                      >
                        Start Assessment
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm animate-slide-in-up overflow-hidden"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative space-y-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        View Your Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative flex flex-col gap-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Analyze your performance across different skills. Get
                        insights into your strengths and growth opportunities.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Trophy className="w-4 h-4" />
                        Detailed analytics & insights
                      </div>
                      <Button
                        onClick={() => navigate("/reports")}
                        variant="outline"
                        className="w-full h-12 border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300 group/btn"
                      >
                        View Progress
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {isAdmin && (
                <>
                  <Card
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm animate-slide-in-up overflow-hidden"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative space-y-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        Manage Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative flex flex-col gap-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Create, edit, and organize quiz questions across
                        different skill categories. Build comprehensive
                        assessments.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Shield className="w-4 h-4" />
                        Admin privileges required
                      </div>
                      <Button
                        onClick={() => navigate("/admin#questions")}
                        className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 group/btn"
                      >
                        Manage Content
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm animate-slide-in-up overflow-hidden"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative space-y-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        User Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative flex flex-col gap-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Monitor user performance, identify skill gaps, and track
                        learning progress across your organization.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <BarChart3 className="w-4 h-4" />
                        Comprehensive reporting suite
                      </div>
                      <Button
                        onClick={() => navigate("/admin#reports")}
                        variant="outline"
                        className="w-full h-12 border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300 group/btn"
                      >
                        View Analytics
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
