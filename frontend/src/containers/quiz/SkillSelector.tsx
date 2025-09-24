import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Skill } from "@/types/common.types";

interface SkillSelectorProps {
  skills: Skill[];
  loading: boolean;
  onChange: (value: string) => void;
}

const SkillSelector = ({ skills, loading, onChange }: SkillSelectorProps) => (
  <div className="my-4">
    <Label>Select a Skill</Label>
    {loading ? (
      <Skeleton className="w-full h-10 mt-2" />
    ) : skills.length > 0 ? (
      <Select onValueChange={onChange}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Choose a skill" />
        </SelectTrigger>
        <SelectContent>
          {skills.map((skill) => (
            <SelectItem key={skill.id} value={String(skill.id)}>
              {skill.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <p className="text-muted-foreground text-sm mt-2">No skills available.</p>
    )}
  </div>
);

export default SkillSelector;
