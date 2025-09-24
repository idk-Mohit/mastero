export interface Question {
  options: { id: number; label: string; text: string }[];
  difficulty: "easy" | "medium";
  id: number;
  is_active: number;
  skill_id: number;
  text: string;
}

export interface Skill {
  description: string;
  id: number;
  name: string;
}
