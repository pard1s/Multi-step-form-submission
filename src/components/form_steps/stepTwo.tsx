"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "@/lib/store";
import { StepSkillsLangSchema } from "@/lib/types";

type SkillsLangData = z.input<typeof StepSkillsLangSchema>;

const skillLevels = ["beginner", "intermediate", "advanced", "expert"] as const;
const languageProficiency = [
  "basic",
  "conversational",
  "fluent",
  "native",
] as const;

export default function Step2() {
  const { data, merge, next, prev } = useFormStore();

  const [skills, setSkills] = React.useState(data.skills);
  const [languages, setLanguages] = React.useState(data.languages);

  const [skillName, setSkillName] = React.useState("");
  const [skillLevel, setSkillLevel] =
    React.useState<(typeof skillLevels)[number]>("beginner");

  const [langName, setLangName] = React.useState("");
  const [langProf, setLangProf] =
    React.useState<(typeof languageProficiency)[number]>("basic");

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<SkillsLangData>({
    resolver: zodResolver(StepSkillsLangSchema),
    defaultValues: { skills, languages },
  });

  const onSubmit = (values: SkillsLangData) => {
    setSubmitError(null);
    const parsed = StepSkillsLangSchema.safeParse(values);
    if (!parsed.success) {
      setSubmitError("Please add valid skills and languages.");
      return;
    }
    merge(parsed.data);
    next();
  };

  const addSkill = () => {
    if (!skillName.trim()) return;
    setSkills((prev) => [
      ...prev,
      { name: skillName.trim(), level: skillLevel },
    ]);
    setSkillName("");
    form.setValue("skills", [
      ...skills,
      { name: skillName.trim(), level: skillLevel },
    ]);
  };

  const removeSkill = (idx: number) => {
    const nextArr = skills.filter((_, i) => i !== idx);
    setSkills(nextArr);
    form.setValue("skills", nextArr);
  };

  const addLanguage = () => {
    if (!langName.trim()) return;
    setLanguages((prev) => [
      ...prev,
      { name: langName.trim(), proficiency: langProf },
    ]);
    setLangName("");
    form.setValue("languages", [
      ...languages,
      { name: langName.trim(), proficiency: langProf },
    ]);
  };

  const removeLanguage = (idx: number) => {
    const nextArr = languages.filter((_, i) => i !== idx);
    setLanguages(nextArr);
    form.setValue("languages", nextArr);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Skills & Languages
        </h2>
        <p className="text-sm text-muted-foreground">
          Add your strongest skills and languages.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              Add a skill <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Skill name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
              <Select
                value={skillLevel}
                onValueChange={(value: (typeof skillLevels)[number]) =>
                  setSkillLevel(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addSkill}>
                Add skill
              </Button>
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <div className="space-y-2">
                    {skills.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No skills added yet.
                      </p>
                    )}
                    {skills.map((s, i) => (
                      <div
                        key={`${s.name}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                      >
                        <span className="text-sm">
                          {s.name} — {s.level}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(i)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              Add a language <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Language"
                value={langName}
                onChange={(e) => setLangName(e.target.value)}
              />
              <Select
                value={langProf}
                onValueChange={(value: (typeof languageProficiency)[number]) =>
                  setLangProf(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {languageProficiency.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addLanguage}>
                Add language
              </Button>
            </div>

            <FormField
              control={form.control}
              name="languages"
              render={() => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <div className="space-y-2">
                    {languages.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No languages added yet.
                      </p>
                    )}
                    {languages.map((l, i) => (
                      <div
                        key={`${l.name}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                      >
                        <span className="text-sm">
                          {l.name} — {l.proficiency}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLanguage(i)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="outline" onClick={prev}>
              Back
            </Button>
            <Button type="submit" className="ml-auto">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
