import { useState } from "react";

export type AttemptRow = {
  id: string;
  quiz_id: string;
  score_pct: number;
  started_at: string;
  completed_at: string | null;
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
  showUserColumn?: boolean;
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
      className={`flex items-center justify-between gap-3 rounded-lg p-3 transition-all duration-200 ${
        isCorrect
          ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
          : isSelected
          ? "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
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
    <div className="card-enhanced rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {title}
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200"
          >
            Refresh
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <p className="text-gray-500 font-medium">No reports found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {showUserColumn && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                )}
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
              {attempts.map((r, index) => (
                <tr
                  key={r.id}
                  className="table-row-hover cursor-pointer stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleRowClick(r.id)}
                >
                  {showUserColumn && (
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {r.email || r.user_id}
                    </td>
                  )}
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
      )}

      {/* Modal */}
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
              ) : attemptDetail ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Quiz ID:{" "}
                      <span className="font-medium">
                        {attemptDetail.quiz_id}
                      </span>{" "}
                      • Score:{" "}
                      <span className="font-medium text-purple-600">
                        {attemptDetail.score_pct}%
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {attemptDetail.questions.map((q, index) => (
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
