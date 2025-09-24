import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import ReportsSection from "../admin/ReportSection";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

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

// shuffle helper
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Small component for rendering an option
function OptionItem({
  opt,
  isSelected,
  isCorrect,
}: {
  opt: { id: string; label: string; text: string };
  isSelected: boolean;
  isCorrect: boolean;
}) {
  console.log(isSelected, isCorrect, opt);
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-md border p-2 ${
        isCorrect
          ? "border-green-500/60 bg-green-500/10"
          : isSelected
          ? "border-red-500/60 bg-red-500/10"
          : "border-muted"
      }`}
    >
      <div className="flex items-center gap-2">
        {isCorrect ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : isSelected ? (
          <XCircle className="h-4 w-4 text-red-600" />
        ) : (
          <div className="h-4 w-4" />
        )}
        <span className="text-sm">
          {opt.label}. {opt.text}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isSelected && (
          <Badge variant="secondary" className="text-xs">
            Your choice
          </Badge>
        )}
        {isCorrect && (
          <Badge className="bg-green-600 hover:bg-green-600 text-xs">
            Correct
          </Badge>
        )}
      </div>
    </div>
  );
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
        setReports(res.data?.attempts);
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

      // shuffle options once
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
    return <p className="text-center py-10">Loading reports...</p>;
  }

  if (reports.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        No reports yet. Take some quizzes!
      </p>
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
    <div className="container mx-auto py-8 space-y-8">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reports}>
                <XAxis
                  dataKey="started_at"
                  tickFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(val) => new Date(val).toLocaleString()}
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="score_pct"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-background text-foreground">
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(r.id)}
                >
                  <TableCell>{r.quiz_id}</TableCell>
                  <TableCell>{r.score_pct}%</TableCell>
                  <TableCell>
                    {new Date(r.started_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {r.completed_at
                      ? new Date(r.completed_at).toLocaleString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attempt Details</DialogTitle>
          </DialogHeader>

          {loadingDetail && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loadingDetail && selectedAttempt && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Quiz ID: {selectedAttempt.quiz_id} • Score:{" "}
                {selectedAttempt.score_pct}%
              </p>

              {/* Questions */}
              <div className="space-y-4">
                {selectedAttempt.questions.map((q) => (
                  <Card
                    key={q.question_id}
                    className="bg-background text-foreground"
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{q.text}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {q.options.map((opt) => {
                        // 🔧 normalize to string to avoid 1 vs "1" mismatches
                        const selectedId =
                          q.selected_option_id != null
                            ? String(q.selected_option_id)
                            : "";
                        const optionId = opt.id != null ? String(opt.id) : "";
                        const isSelected =
                          selectedId !== "" && optionId === selectedId;
                        const isCorrect = Boolean(opt.is_correct);

                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center justify-between gap-2 rounded-md border p-2 ${
                              isCorrect
                                ? "border-green-500/60 bg-green-500/10"
                                : isSelected
                                ? "border-red-500/60 bg-red-500/10"
                                : "border-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <svg
                                  className="h-4 w-4 text-green-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M20 7L10 17l-6-6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : isSelected ? (
                                <svg
                                  className="h-4 w-4 text-red-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M18 6L6 18M6 6l12 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                <div className="h-4 w-4" />
                              )}
                              <span className="text-sm">
                                {opt.label}. {opt.text}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <span className="rounded px-2 py-0.5 text-xs bg-muted  text-black">
                                  Your choice
                                </span>
                              )}
                              {isCorrect && (
                                <span className="rounded px-2 py-0.5 text-xs bg-green-600 text-white">
                                  Correct
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
