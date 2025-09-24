import { useEffect, useState } from "react";
import type { AttemptDetail, AttemptRow } from "../reports/ReportAttempView";
import ReportAttemptsView from "../reports/ReportAttempView";

type Report = {
  id: string;
  user_id: string;
  email: string;
  quiz_id: string;
  started_at: string;
  completed_at: string | null;
  score_pct: number;
};

export default function ReportsSection() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"all" | "user">("all");
  const [userId, setUserId] = useState("");

  const loadReports = async () => {
    setLoading(true);
    let url = "/api/report";
    if (viewMode === "all") url += "/all";
    else if (viewMode === "user" && userId) url += `/user/${userId}`;

    const params = new URLSearchParams();
    if (filter !== "all") params.append("filter", filter);

    const res = await fetch(`${url}?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      setReports(
        viewMode === "user" ? data.data.attempts || [] : data.data || []
      );
    } else {
      setReports([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, [filter, viewMode]);

  const fetchAttemptDetail = async (
    attemptId: string
  ): Promise<AttemptDetail> => {
    const res = await fetch(`/api/report/attempt/${attemptId}`);
    const data = await res.json();
    return data.data as AttemptDetail;
  };

  const rows: AttemptRow[] = reports.map((r) => ({
    ...r,
    id: String(r.id),
    user_id: String(r.user_id),
  }));

  return (
    <div className="card-enhanced rounded-xl p-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          User Reports
        </h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as "all" | "user")}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Users</option>
            <option value="user">By User</option>
          </select>

          {viewMode === "user" && (
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          )}

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      <ReportAttemptsView
        title={viewMode === "all" ? "All Attempts" : "User Attempts"}
        attempts={rows}
        loading={loading}
        showUserColumn={viewMode === "all"}
        onRefresh={loadReports}
        fetchAttemptDetail={fetchAttemptDetail}
      />
    </div>
  );
}
