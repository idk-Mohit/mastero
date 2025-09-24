import { useState } from "react";
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
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export type AttemptRow = {
  id: string;
  quiz_id: string;
  score_pct: number;
  started_at: string;
  completed_at: string | null;
  // optional admin column
  email?: string;
  user_id?: string;
};

export type AttemptDetail = {
  id: string;
  quiz_id: string;
  score_pct: number;
  started_at: string;
  completed_at: string | null;
  questions: {
    question_id: string;
    text: string;
    selected_option_id: string | number;
    is_correct: boolean;
    answered_at: string;
    options: {
      id: string | number;
      label: string;
      text: string;
      is_correct: boolean;
    }[];
  }[];
};

type Props = {
  title?: string;
  attempts: AttemptRow[];
  loading?: boolean;
  showUserColumn?: boolean; // show user/email column (admin view)
  onRefresh?: () => void;
  fetchAttemptDetail: (attemptId: string) => Promise<AttemptDetail>;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function OptionItem({
  opt,
  isSelected,
  isCorrect,
}: {
  opt: { id: string | number; label: string; text: string };
  isSelected: boolean;
  isCorrect: boolean;
}) {
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

export default function ReportAttemptsView({
  title = "Quiz Attempts",
  attempts,
  loading,
  showUserColumn = false,
  onRefresh,
  fetchAttemptDetail,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [attemptDetail, setAttemptDetail] = useState<AttemptDetail | null>(
    null
  );

  const handleRowClick = async (attemptId: string) => {
    setOpen(true);
    setLoadingDetail(true);
    try {
      const detail = await fetchAttemptDetail(attemptId);
      // shuffle options ONCE per question
      const shuffled = {
        ...detail,
        questions: detail.questions.map((q) => ({
          ...q,
          options: shuffle(q.options),
        })),
      };
      setAttemptDetail(shuffled);
    } catch (e) {
      console.error(e);
      setAttemptDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {onRefresh ? (
          <button
            onClick={onRefresh}
            className="text-sm underline underline-offset-4 text-muted-foreground"
          >
            Refresh
          </button>
        ) : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-10">Loading…</p>
        ) : attempts.length === 0 ? (
          <p className="text-muted-foreground">No reports found.</p>
        ) : (
          <Table>
            <TableHeader className="bg-background text-foreground">
              <TableRow>
                {showUserColumn && <TableHead>User</TableHead>}
                <TableHead>Quiz</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(r.id)}
                >
                  {showUserColumn && (
                    <TableCell>{r.email || r.user_id}</TableCell>
                  )}
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
        )}
      </CardContent>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attempt Details</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : attemptDetail ? (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Quiz ID: {attemptDetail.quiz_id} • Score:{" "}
                {attemptDetail.score_pct}%
              </p>

              <div className="space-y-4">
                {attemptDetail.questions.map((q) => (
                  <Card
                    key={q.question_id}
                    className="bg-background text-foreground"
                  >
                    <div className="px-6 pt-6 pb-2 font-medium">{q.text}</div>
                    <CardContent className="space-y-2">
                      {q.options.map((opt) => {
                        const selectedId =
                          q.selected_option_id != null
                            ? String(q.selected_option_id)
                            : "";
                        const optionId = opt.id != null ? String(opt.id) : "";
                        const isSelected =
                          selectedId !== "" && optionId === selectedId;
                        const isCorrect = !!opt.is_correct;

                        return (
                          <OptionItem
                            key={String(opt.id)}
                            opt={opt}
                            isSelected={isSelected}
                            isCorrect={isCorrect}
                          />
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Unable to load attempt details.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
