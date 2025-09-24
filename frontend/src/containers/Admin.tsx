import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SkillsSection from "./admin/SkillSection";
import QuestionsSection from "./admin/QuestionSection";
import ReportsSection from "./admin/ReportSection";
import { useLocation, useNavigate } from "react-router";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "skills" | "questions" | "reports"
  >("skills");

  // on load: prefer state.tab, then hash
  useEffect(() => {
    if (location.state?.tab) {
      const tab = location.state.tab as "skills" | "questions" | "reports";
      setActiveTab(tab);
      navigate(`/admin#${tab}`, { replace: true, state: {} }); // clean state after using it
    } else if (location.hash) {
      const tab = location.hash.replace("#", "") as
        | "skills"
        | "questions"
        | "reports";
      if (["skills", "questions", "reports"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [location, navigate]);

  const handleTabChange = (tab: "skills" | "questions" | "reports") => {
    setActiveTab(tab);
    navigate(`#${tab}`, { replace: true });
  };

  return (
    <div className="h-fit flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-60 border-r bg-muted/40 p-4 flex flex-col gap-2">
        <Button
          variant={activeTab === "skills" ? "default" : "ghost"}
          className="justify-start"
          onClick={() => handleTabChange("skills")}
        >
          Skills
        </Button>
        <Button
          variant={activeTab === "questions" ? "default" : "ghost"}
          className="justify-start"
          onClick={() => handleTabChange("questions")}
        >
          Questions
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          className="justify-start"
          onClick={() => handleTabChange("reports")}
        >
          Reports
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-[calc(100vh-65px)] overflow-y-auto p-6 space-y-6">
        {activeTab === "skills" && <SkillsSection />}
        {activeTab === "questions" && <QuestionsSection />}
        {activeTab === "reports" && <ReportsSection />}
      </main>
    </div>
  );
}
