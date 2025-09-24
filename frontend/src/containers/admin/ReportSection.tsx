"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ReportAttemptsView, {
  type AttemptDetail,
  type AttemptRow,
} from "../reports/ReportAttempView";

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
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle>User Reports</CardTitle>
        <div className="flex flex-wrap gap-3">
          <Select
            value={viewMode}
            onValueChange={(v: "all" | "user") => setViewMode(v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="user">By User</SelectItem>
            </SelectContent>
          </Select>

          {viewMode === "user" && (
            <Input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-[160px]"
            />
          )}

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ReportAttemptsView
          title={viewMode === "all" ? "All Attempts" : "User Attempts"}
          attempts={rows}
          loading={loading}
          showUserColumn={viewMode === "all"}
          onRefresh={loadReports}
          fetchAttemptDetail={fetchAttemptDetail}
        />
      </CardContent>
    </Card>
  );
}
