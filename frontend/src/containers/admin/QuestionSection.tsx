import { useEffect, useState } from "react";

type Option = {
  id: number;
  label: string | null;
  text: string;
  is_correct: number | boolean;
};

type Question = {
  id: number;
  text: string;
  skill_id: number;
  difficulty?: string | null;
  options?: Option[];
};

type Skill = {
  id: number;
  name: string;
};

export default function QuestionsSection() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: "", difficulty: "" });
  const [openOption, setOpenOption] = useState(false);
  const [newOption, setNewOption] = useState({
    label: "",
    text: "",
    is_correct: false,
    question_id: 0,
  });
  const [editOptionOpen, setEditOptionOpen] = useState(false);
  const [editOptionData, setEditOptionData] = useState<{
    id: number | null;
    label: string;
    text: string;
    is_correct: boolean;
  }>({ id: null, label: "", text: "", is_correct: false });

  const loadSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    if (data.success) {
      setSkills(data.data);
      if (data.data.length > 0 && !selectedSkill) {
        setSelectedSkill(data.data[0].id);
      }
    }
  };

  const loadQuestions = async (skill_id: number) => {
    const res = await fetch(
      `/api/questions/questionWithOptions?skill_id=${skill_id}`
    );
    const data = await res.json();
    if (data.success) setQuestions(data.data);
    else setQuestions([]);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    if (selectedSkill) loadQuestions(selectedSkill);
  }, [selectedSkill]);

  const addQuestion = async () => {
    if (!selectedSkill) return;
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newQuestion.text.trim(),
        skill_id: selectedSkill,
        difficulty: newQuestion.difficulty.trim() || null,
      }),
    });
    setNewQuestion({ text: "", difficulty: "" });
    setOpenQuestion(false);
    loadQuestions(selectedSkill);
  };

  const deleteQuestion = async (id: number) => {
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (selectedSkill) loadQuestions(selectedSkill);
  };

  const addOption = async () => {
    if (!newOption.question_id) return;
    await fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: newOption.question_id,
        label: newOption.label.trim() || null,
        text: newOption.text.trim(),
        is_correct: !!newOption.is_correct,
      }),
    });
    setNewOption({ label: "", text: "", is_correct: false, question_id: 0 });
    setOpenOption(false);
    if (selectedSkill) loadQuestions(selectedSkill);
  };

  const openEditOption = (opt: Option) => {
    setEditOptionData({
      id: opt.id,
      label: opt.label || "",
      text: opt.text || "",
      is_correct: !!opt.is_correct,
    });
    setEditOptionOpen(true);
  };

  const updateOption = async () => {
    if (!editOptionData.id) return;
    await fetch(`/api/options/${editOptionData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: editOptionData.label.trim() || null,
        text: editOptionData.text.trim(),
        is_correct: !!editOptionData.is_correct,
      }),
    });
    setEditOptionOpen(false);
    if (selectedSkill) loadQuestions(selectedSkill);
  };

  const deleteOption = async (id: number) => {
    await fetch(`/api/options/${id}`, { method: "DELETE" });
    if (selectedSkill) loadQuestions(selectedSkill);
  };

  return (
    <div className="card-enhanced rounded-xl p-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Manage Questions & Options
        </h2>

        <div className="flex gap-3">
          <select
            value={selectedSkill ? String(selectedSkill) : ""}
            onChange={(e) => setSelectedSkill(Number(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select skill</option>
            {skills.map((skill) => (
              <option key={skill.id} value={String(skill.id)}>
                {skill.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOpenQuestion(true)}
            disabled={!selectedSkill}
            className="btn-gradient px-4 py-2 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Question
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            No questions found for this skill
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover-lift stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{q.text}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {q.difficulty || "No difficulty"}
                  </span>
                </div>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-3">
                {q.options?.length ? (
                  q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            opt.is_correct ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm text-gray-700">
                          {(opt.label ? `${opt.label}. ` : "") + opt.text}
                        </span>
                        {opt.is_correct && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Correct
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditOption(opt)}
                          className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOption(opt.id)}
                          className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No options yet</p>
                )}

                <button
                  onClick={() => {
                    setNewOption({ ...newOption, question_id: q.id });
                    setOpenOption(true);
                  }}
                  className="w-full py-2 text-sm text-purple-600 border border-purple-200 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  Add Option
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Modal */}
      {openQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4 animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Question
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newQuestion.text}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, text: e.target.value })
                    }
                    placeholder="e.g. What does useEffect do?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <input
                    type="text"
                    value={newQuestion.difficulty}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        difficulty: e.target.value,
                      })
                    }
                    placeholder="easy / medium / hard"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={addQuestion}
                    className="flex-1 btn-gradient py-2 text-white font-medium rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setOpenQuestion(false)}
                    className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Option Modal */}
      {openOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4 animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Option
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={newOption.label}
                    onChange={(e) =>
                      setNewOption({ ...newOption, label: e.target.value })
                    }
                    placeholder="A / B / C / D"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option Text
                  </label>
                  <input
                    type="text"
                    value={newOption.text}
                    onChange={(e) =>
                      setNewOption({ ...newOption, text: e.target.value })
                    }
                    placeholder="Option text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newOption.is_correct}
                    onChange={(e) =>
                      setNewOption({
                        ...newOption,
                        is_correct: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Is Correct
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={addOption}
                    className="flex-1 btn-gradient py-2 text-white font-medium rounded-lg"
                  >
                    Save Option
                  </button>
                  <button
                    onClick={() => setOpenOption(false)}
                    className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Option Modal */}
      {editOptionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4 animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Option
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={editOptionData.label}
                    onChange={(e) =>
                      setEditOptionData((s) => ({
                        ...s,
                        label: e.target.value,
                      }))
                    }
                    placeholder="A / B / C / D"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option Text
                  </label>
                  <input
                    type="text"
                    value={editOptionData.text}
                    onChange={(e) =>
                      setEditOptionData((s) => ({ ...s, text: e.target.value }))
                    }
                    placeholder="Option text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editOptionData.is_correct}
                    onChange={(e) =>
                      setEditOptionData((s) => ({
                        ...s,
                        is_correct: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Is Correct
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={updateOption}
                    className="flex-1 btn-gradient py-2 text-white font-medium rounded-lg"
                  >
                    Update Option
                  </button>
                  <button
                    onClick={() => setEditOptionOpen(false)}
                    className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
