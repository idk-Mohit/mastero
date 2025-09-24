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
import { ChevronDown, Zap } from "lucide-react";

interface SkillSelectorProps {
  skills: Skill[];
  loading: boolean;
  onChange: (value: string) => void;
}

const SkillSelector = ({ skills, loading, onChange }: SkillSelectorProps) => (
  <div className="space-y-4 animate-slide-in-up">
    <div className="flex items-center gap-2">
      <Zap className="w-5 h-5 text-primary" />
      <Label className="text-lg font-semibold text-foreground">
        Choose Your Skill
      </Label>
    </div>

    {loading ? (
      /* Enhanced loading state with multiple skeletons */
      <div className="space-y-3">
        <Skeleton className="w-full h-14 rounded-xl animate-pulse" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      </div>
    ) : skills.length > 0 ? (
      /* Enhanced select with custom styling */
      <div className="relative animate-fade-in">
        <Select onValueChange={onChange}>
          <SelectTrigger className="h-14 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-xl bg-card/50 backdrop-blur-sm group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <SelectValue
                placeholder="Select a skill to begin your assessment"
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </SelectTrigger>
          <SelectContent className="border-2 border-border rounded-xl shadow-2xl bg-card/95 backdrop-blur-sm">
            {skills.map((skill, index) => (
              <SelectItem
                key={skill.id}
                value={String(skill.id)}
                className="h-12 rounded-lg hover:bg-primary/10 focus:bg-primary/10 transition-all duration-200 cursor-pointer animate-slide-in-right"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {skill.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{skill.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
          <span>{skills.length} skills available for assessment</span>
        </div>
      </div>
    ) : (
      /* Enhanced empty state */
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">
          No skills available at the moment.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Please check back later or contact your administrator.
        </p>
      </div>
    )}
  </div>
);

export default SkillSelector;
