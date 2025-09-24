import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import SkillsSection from "./admin/SkillSection";
import QuestionsSection from "./admin/QuestionSection";
import ReportsSection from "./admin/ReportSection";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "skills" | "questions" | "reports"
  >("skills");

  useEffect(() => {
    if (location.state?.tab) {
      const tab = location.state.tab as "skills" | "questions" | "reports";
      setActiveTab(tab);
      navigate(`/admin#${tab}`, { replace: true, state: {} });
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

  const tabs = [
    { id: "skills", label: "Skills", icon: "🎯" },
    { id: "questions", label: "Questions", icon: "❓" },
    { id: "reports", label: "Reports", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 glass rounded-r-2xl p-6 m-4 mr-0 animate-slide-up">
          <div className="space-y-2">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() =>
                  handleTabChange(tab.id as "skills" | "questions" | "reports")
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 stagger-item ${
                  activeTab === tab.id
                    ? "btn-gradient text-black shadow-lg"
                    : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto max-h-screen">
          <div className="animate-fade-in">
            {activeTab === "skills" && <SkillsSection />}
            {activeTab === "questions" && <QuestionsSection />}
            {activeTab === "reports" && <ReportsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
