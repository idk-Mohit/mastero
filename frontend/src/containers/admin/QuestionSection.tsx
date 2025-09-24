import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Add Question dialog
  const [openQuestion, setOpenQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: "", difficulty: "" });

  // Add Option dialog
  const [openOption, setOpenOption] = useState(false);
  const [newOption, setNewOption] = useState({
    label: "",
    text: "",
    is_correct: false,
    question_id: 0,
  });

  // Edit Option dialog
  const [editOptionOpen, setEditOptionOpen] = useState(false);
  const [editOptionData, setEditOptionData] = useState<{
    id: number | null;
    label: string;
    text: string;
    is_correct: boolean;
  }>({ id: null, label: "", text: "", is_correct: false });

  // -------- data loaders --------
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

  // -------- question CRUD --------
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

  // -------- option CRUD --------
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
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle>Manage Questions & Options</CardTitle>

        <div className="flex gap-3">
          <Select
            value={selectedSkill ? String(selectedSkill) : ""}
            onValueChange={(val) => setSelectedSkill(Number(val))}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select skill" />
            </SelectTrigger>
            <SelectContent>
              {skills.map((skill) => (
                <SelectItem key={skill.id} value={String(skill.id)}>
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={openQuestion} onOpenChange={setOpenQuestion}>
            <DialogTrigger asChild>
              <Button disabled={!selectedSkill}>Add Question</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Question</Label>
                  <Input
                    value={newQuestion.text}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, text: e.target.value })
                    }
                    placeholder="e.g. What does useEffect do?"
                  />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Input
                    value={newQuestion.difficulty}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        difficulty: e.target.value,
                      })
                    }
                    placeholder="easy / medium / hard"
                  />
                </div>
                <Button onClick={addQuestion}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {questions.length === 0 ? (
          <p className="text-muted-foreground">
            No questions found for this skill.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="align-top">{q.text}</TableCell>
                  <TableCell className="align-top">
                    {q.difficulty || "-"}
                  </TableCell>

                  <TableCell>
                    {q.options?.length ? (
                      <ul className="space-y-1">
                        {q.options.map((opt) => (
                          <li
                            key={opt.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="truncate">
                              {(opt.label ? `${opt.label}. ` : "") + opt.text}{" "}
                              {opt.is_correct ? (
                                <span className="text-green-600 font-semibold">
                                  ✔
                                </span>
                              ) : null}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openEditOption(opt)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteOption(opt.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No options yet
                      </span>
                    )}

                    {/* Add Option */}
                    <Dialog open={openOption} onOpenChange={setOpenOption}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="mt-2"
                          onClick={() =>
                            setNewOption({ ...newOption, question_id: q.id })
                          }
                        >
                          Add Option
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Option for Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <Label>Label</Label>
                            <Input
                              value={newOption.label}
                              onChange={(e) =>
                                setNewOption({
                                  ...newOption,
                                  label: e.target.value,
                                })
                              }
                              placeholder="A / B / C / D"
                            />
                          </div>
                          <div>
                            <Label>Option Text</Label>
                            <Input
                              value={newOption.text}
                              onChange={(e) =>
                                setNewOption({
                                  ...newOption,
                                  text: e.target.value,
                                })
                              }
                              placeholder="Option text"
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
                            />
                            <Label>Is Correct</Label>
                          </div>
                          <Button onClick={addOption}>Save Option</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  <TableCell className="align-top">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteQuestion(q.id)}
                    >
                      Delete Q
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Edit Option Dialog */}
        <Dialog open={editOptionOpen} onOpenChange={setEditOptionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Option</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Label</Label>
                <Input
                  value={editOptionData.label}
                  onChange={(e) =>
                    setEditOptionData((s) => ({ ...s, label: e.target.value }))
                  }
                  placeholder="A / B / C / D"
                />
              </div>
              <div>
                <Label>Option Text</Label>
                <Input
                  value={editOptionData.text}
                  onChange={(e) =>
                    setEditOptionData((s) => ({ ...s, text: e.target.value }))
                  }
                  placeholder="Option text"
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
                />
                <Label>Is Correct</Label>
              </div>
              <Button onClick={updateOption}>Update Option</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
