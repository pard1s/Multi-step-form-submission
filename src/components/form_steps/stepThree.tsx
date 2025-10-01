"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { WorkExperienceSchema } from "@/lib/types";

export default function Step3() {
  const { data, merge, next, prev } = useFormStore();

  const [local, setLocal] = React.useState(data.experiences);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  const addExperience = () => {
    const newExperience = {
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setLocal((p) => [...p, newExperience]);
    setEditIndex(local.length);
  };

  const removeItem = (idx: number) => {
    const updatedExperiences = local.filter((_, i) => i !== idx);
    setLocal(updatedExperiences);
    merge({ experiences: updatedExperiences });
    if (editIndex === idx) {
      setEditIndex(null);
    }
  };

  const onSubmit = () => {
    setSubmitError(null);
    // sync local edits
    if (editIndex !== null) {
      setSubmitError("Please save or cancel your current experience edit.");
      return;
    }
    // validating all experiences before proceeding to next step
    const allValid = local.every(
      (exp) => WorkExperienceSchema.safeParse(exp).success
    );
    if (!allValid) {
      setSubmitError("Please ensure all added experiences are valid.");
      return;
    }
    next();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Work experience
        </h2>
        <p className="text-sm text-muted-foreground">
          List relevant roles, newest first.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={addExperience}>
            Add role
          </Button>
        </div>

        {local.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No experience added yet.
          </p>
        )}
        {local.map((exp, idx) => (
          <div key={idx} className="space-y-3 rounded-md border p-4">
            {editIndex === idx ? (
              <ExperienceForm
                key={idx}
                experience={local[idx]}
                onSave={(updatedExp) => {
                  const updatedExperiences = local.map((item, i) =>
                    i === idx ? updatedExp : item
                  );
                  setLocal(updatedExperiences);
                  merge({ experiences: updatedExperiences });
                  setEditIndex(null);
                }}
                onCancel={() => setEditIndex(null)}
                onRemove={() => removeItem(idx)}
              />
            ) : (
              <ExperienceDisplay
                key={idx}
                experience={exp}
                onEdit={() => setEditIndex(idx)}
                onRemove={() => removeItem(idx)}
              />
            )}
          </div>
        ))}

        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="button" variant="outline" onClick={prev}>
            Back
          </Button>
          <Button type="button" className="ml-auto" onClick={onSubmit}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

interface ExperienceFormProps {
  experience: z.infer<typeof WorkExperienceSchema>;
  onSave: (updatedExp: z.infer<typeof WorkExperienceSchema>) => void;
  onCancel: () => void;
  onRemove: () => void;
}

function ExperienceForm({
  experience,
  onSave,
  onCancel,
  onRemove,
}: ExperienceFormProps) {
  const form = useForm<z.infer<typeof WorkExperienceSchema>>({
    resolver: zodResolver(WorkExperienceSchema),
    defaultValues: experience,
  });

  const onSubmit = (values: z.infer<typeof WorkExperienceSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Input placeholder="Company Name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Input placeholder="Job Title" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Input placeholder="City, Country" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Responsibilities and achievements"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onRemove}>
            Remove
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}

interface ExperienceDisplayProps {
  experience: z.infer<typeof WorkExperienceSchema>;
  onEdit: () => void;
  onRemove: () => void;
}

function ExperienceDisplay({
  experience,
  onEdit,
  onRemove,
}: ExperienceDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">
          {experience.title} at {experience.company}
        </h4>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{experience.location}</p>
      <p className="text-sm text-muted-foreground">
        {experience.startDate} - {experience.endDate || "Present"}
      </p>
      {experience.description && (
        <p className="text-sm text-muted-foreground">
          {experience.description}
        </p>
      )}
    </div>
  );
}
