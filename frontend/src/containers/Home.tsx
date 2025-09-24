import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Welcome {user?.email || "User"}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Take a Quiz</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p>Select a skill and start assessing yourself!</p>
                  <Button onClick={() => navigate("/quiz")}>Start Quiz</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>View Your Reports</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p>Check how you've been performing in different skills.</p>
                  <Button onClick={() => navigate("/reports")}>
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {isAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Questions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p>Add, edit, or remove quiz questions across skills.</p>
                  <Button onClick={() => navigate("/admin#questions")}>
                    Manage Questions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Reports</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p>View user performances and skill gaps.</p>
                  <Button onClick={() => navigate("/admin#reports")}>
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
