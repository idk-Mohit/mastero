import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ReportsSection from "../admin/ReportSection";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";

type Attempt = {
  id: string;
  quiz_id: string;
  score_pct: number;
  started_at: string;
  completed_at: string | null;
};

type AttemptDetail = {
  id: string;
  quiz_id: string;
  score_pct: number;
  started_at: string;
  completed_at: string | null;
  questions: {
    question_id: string;
    text: string;
    selected_option_id: string;
    is_correct: boolean;
    answered_at: string;
    options: {
      id: string;
      label: string;
      text: string;
      is_correct: boolean;
    }[];
  }[];
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ReportsPage() {
  const { fetch } = useFetch();
  const { user } = useAuth();
  const [reports, setReports] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptDetail | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const res = await fetch({
          url: `/api/report/user/${user?.id}`,
        });
        setReports(res.data?.attempts || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [user?.id]);

  const handleRowClick = async (attemptId: string) => {
    setLoadingDetail(true);
    setOpen(true);
    try {
      const res = await fetch({
        url: `/api/report/attempt/${attemptId}`,
      });

      const withShuffled = {
        ...res.data,
        questions: res.data.questions.map((q: any) => ({
          ...q,
          options: shuffle(q.options),
        })),
      };

      setSelectedAttempt(withShuffled);
    } catch (err) {
      console.error("Error fetching attempt details:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No reports yet
          </h2>
          <p className="text-gray-500">
            Take some quizzes to see your performance!
          </p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <ReportsSection />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fade-in">
      {/* Chart */}
      <div className="card-enhanced rounded-xl p-6 animate-slide-up">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Performance Over Time
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reports}>
              <XAxis
                dataKey="started_at"
                tickFormatter={(val) => new Date(val).toLocaleDateString()}
                stroke="#6b7280"
              />
              <YAxis domain={[0, 100]} stroke="#6b7280" />
              <Tooltip
                labelFormatter={(val) => new Date(val).toLocaleString()}
                formatter={(value: number) => [`${value}%`, "Score"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="score_pct"
                stroke="url(#gradient)"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#8b5cf6" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div
        className="card-enhanced rounded-xl p-6 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Quiz Attempts
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((r, index) => (
                <tr
                  key={r.id}
                  className="table-row-hover cursor-pointer stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleRowClick(r.id)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {r.quiz_id}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        r.score_pct >= 80
                          ? "bg-green-100 text-green-800"
                          : r.score_pct >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.score_pct}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(r.started_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {r.completed_at
                      ? new Date(r.completed_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attempt Details
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <div className="spinner w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
                </div>
              ) : selectedAttempt ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Quiz ID:{" "}
                      <span className="font-medium">
                        {selectedAttempt.quiz_id}
                      </span>{" "}
                      • Score:{" "}
                      <span className="font-medium text-purple-600">
                        {selectedAttempt.score_pct}%
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {selectedAttempt.questions.map((q, index) => (
                      <div
                        key={q.question_id}
                        className="bg-white border border-gray-200 rounded-lg p-6 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <h4 className="font-semibold text-gray-900 mb-4">
                          {q.text}
                        </h4>
                        <div className="space-y-3">
                          {q.options.map((opt) => {
                            const selectedId =
                              q.selected_option_id != null
                                ? String(q.selected_option_id)
                                : "";
                            const optionId =
                              opt.id != null ? String(opt.id) : "";
                            const isSelected =
                              selectedId !== "" && optionId === selectedId;
                            const isCorrect = Boolean(opt.is_correct);

                            return (
                              <div
                                key={opt.id}
                                className={`flex items-center justify-between gap-3 rounded-lg p-3 transition-all duration-200 ${
                                  isCorrect
                                    ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
                                    : isSelected
                                    ? "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {isCorrect ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  ) : isSelected ? (
                                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-gray-300" />
                                  )}
                                  <span className="text-sm font-medium text-gray-700">
                                    {opt.label}. {opt.text}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                      Your choice
                                    </span>
                                  )}
                                  {isCorrect && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                      Correct
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Unable to load attempt details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
