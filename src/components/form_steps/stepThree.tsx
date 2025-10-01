"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "@/lib/store";
import {
  StepWorkExperienceAndEducationSchema,
  WorkExperienceSchema,
  EducationItemSchema,
} from "@/lib/types";

import { ExperienceForm } from "@/components/form_steps/sub_components/ExperienceForm";
import { ExperienceDisplay } from "@/components/form_steps/sub_components/ExperienceDisplay";
import { EducationForm } from "@/components/form_steps/sub_components/EducationForm";
import { EducationDisplay } from "@/components/form_steps/sub_components/EducationDisplay";

type ExperienceAndEducationData = z.infer<
  typeof StepWorkExperienceAndEducationSchema
>;

export default function Step3() {
  const { data, merge, next, prev } = useFormStore();

  const [local, setLocal] = React.useState<
    z.infer<typeof WorkExperienceSchema>[]
  >(data.experiences || []);
  const [localEducation, setLocalEducation] = React.useState<
    z.infer<typeof EducationItemSchema>[]
  >(
    (data.education || []).map((item) => ({
      ...item,
      startDate: item.startDate
        ? new Date(item.startDate).toISOString().split("T")[0]
        : "",
      endDate: item.endDate
        ? new Date(item.endDate).toISOString().split("T")[0]
        : "",
    }))
  );

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [editExperienceIndex, setEditExperienceIndex] = React.useState<
    number | null
  >(null);
  const [editEducationIndex, setEditEducationIndex] = React.useState<
    number | null
  >(null);

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
    setEditExperienceIndex(local.length);
  };

  const removeExperience = (idx: number) => {
    const updatedExperiences = local.filter((_, i) => i !== idx);
    setLocal(updatedExperiences);
    merge({ experiences: updatedExperiences });
    if (editExperienceIndex === idx) {
      setEditExperienceIndex(null);
    }
  };

  const addEducation = () => {
    const newEducation = {
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    };
    setLocalEducation((p) => [...p, newEducation]);
    setEditEducationIndex(localEducation.length);
  };

  const removeEducation = (idx: number) => {
    const updatedEducation = localEducation.filter((_, i) => i !== idx);
    setLocalEducation(updatedEducation);
    merge({ education: updatedEducation });
    if (editEducationIndex === idx) {
      setEditEducationIndex(null);
    }
  };

  const form = useForm({
    resolver: zodResolver(StepWorkExperienceAndEducationSchema),
    defaultValues: {
      experiences: local,
      education: localEducation,
    },
  });

  const onSubmit = () => {
    setSubmitError(null);

    if (editExperienceIndex !== null) {
      setSubmitError("Please save or cancel your current experience edit.");
      return;
    }
    if (editEducationIndex !== null) {
      setSubmitError("Please save or cancel your current education edit.");
      return;
    }

    const validationResult = StepWorkExperienceAndEducationSchema.safeParse({
      experiences: local,
      education: localEducation,
    });

    if (!validationResult.success) {
      setSubmitError(
        "Please ensure all experiences and education fields are valid."
      );
      return;
    }

    merge({ experiences: local, education: localEducation });
    next();
  };

  const handleRemoveEducation = React.useCallback(
    (idx: number) => {
      removeEducation(idx);
    },
    [removeEducation]
  );

  const handleCancelEducation = React.useCallback(() => {
    setEditEducationIndex(null);
  }, []);

  const handleSaveEducation = React.useCallback(
    (idx: number, updatedEdu: z.infer<typeof EducationItemSchema>) => {
      const updatedEducation = localEducation.map((item, i) =>
        i === idx ? updatedEdu : item
      );
      setLocalEducation(updatedEducation);
      merge({ education: updatedEducation });
      setEditEducationIndex(null);
    },
    [localEducation, merge]
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Work experience & Education
        </h2>
        <p className="text-sm text-muted-foreground">
          List relevant roles and schools, newest first.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Form {...form}>
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
              {editExperienceIndex === idx ? (
                <ExperienceForm
                  key={idx}
                  experience={local[idx]}
                  onSave={(updatedExp) => {
                    const updatedExperiences = local.map((item, i) =>
                      i === idx ? updatedExp : item
                    );
                    setLocal(updatedExperiences);
                    merge({ experiences: updatedExperiences });
                    setEditExperienceIndex(null);
                  }}
                  onCancel={() => setEditExperienceIndex(null)}
                  onRemove={() => removeExperience(idx)}
                />
              ) : (
                <ExperienceDisplay
                  key={idx}
                  experience={exp}
                  onEdit={() => setEditExperienceIndex(idx)}
                  onRemove={() => removeExperience(idx)}
                />
              )}
            </div>
          ))}
        </Form>

        <h3 className="text-lg font-semibold">Education</h3>
        <Form {...form}>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={addEducation}>
              Add education
            </Button>
          </div>

          {localEducation.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No education added yet.
            </p>
          )}
          {localEducation.map((ed, idx) => (
            <div key={idx} className="space-y-3 rounded-md border p-4">
              {editEducationIndex === idx ? (
                <EducationForm
                  key={idx}
                  education={localEducation[idx]}
                  onSave={(updatedEdu) => handleSaveEducation(idx, updatedEdu)}
                  onCancel={handleCancelEducation}
                  onRemove={() => handleRemoveEducation(idx)}
                />
              ) : (
                <EducationDisplay
                  key={idx}
                  education={ed}
                  onEdit={() => setEditEducationIndex(idx)}
                  onRemove={() => removeEducation(idx)}
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
        </Form>
      </div>
    </div>
  );
}
