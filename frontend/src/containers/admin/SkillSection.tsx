"use client";

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

type Skill = {
  id: number;
  name: string;
  description: string;
  is_active: number;
};

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  // form state
  const [newSkill, setNewSkill] = useState({ name: "", description: "" });
  const [open, setOpen] = useState(false);

  // fetch skills
  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      if (data.success) {
        setSkills(data.data);
      }
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // add skill
  const addSkill = async () => {
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSkill.name,
          description: newSkill.description,
          is_active: 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadSkills();
        setNewSkill({ name: "", description: "" });
        setOpen(false);
      }
    } catch (err) {
      console.error("Failed to add skill:", err);
    }
  };

  // delete skill
  const deleteSkill = async (id: number) => {
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      loadSkills();
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle>Manage Skills</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Skill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  placeholder="e.g. React"
                />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={newSkill.description}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, description: e.target.value })
                  }
                  placeholder="Skill description"
                />
              </div>
              <Button onClick={addSkill}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="text-muted-foreground">No skills found.</p>
        ) : (
          <Table className="">
            <TableHeader className="bg-background text-foreground">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell>{skill.name}</TableCell>
                  <TableCell>{skill.description}</TableCell>
                  <TableCell>
                    {skill.is_active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        alert("Edit modal coming soon for " + skill.name)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSkill(skill.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
