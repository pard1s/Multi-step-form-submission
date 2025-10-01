// src/lib/types.ts
import { z } from "zod";

export const SkillSchema = z.object({
  name: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export const LanguageSchema = z.object({
  name: z.string().min(1),
  proficiency: z.enum(["basic", "conversational", "fluent", "native"]),
});

export const WorkExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
});

export const EducationItemSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(), // empty -> present
});

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const ResumeFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),

  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),

  website: z.url().optional(),
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  linkedin: z.url().optional(),

  skills: z.array(SkillSchema).max(50).default([]),
  languages: z.array(LanguageSchema).max(20).default([]),

  interests: z.array(z.string().min(1)).max(30).default([]),
  hobbies: z.array(z.string().min(1)).max(30).default([]),

  experiences: z.array(WorkExperienceSchema).max(30).default([]),

  education: z.array(EducationItemSchema).max(20),
});

export type ResumeFormData = z.infer<typeof ResumeFormSchema>;

export const StepPersonalSchema = ResumeFormSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
});

export const StepAddressSchema = ResumeFormSchema.pick({
  street: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
});

export const StepSkillsLangSchema = ResumeFormSchema.pick({
  skills: true,
  languages: true,
}).extend({
  skills: z.array(SkillSchema).min(3, "Please add at least three skills."),
  languages: z
    .array(LanguageSchema)
    .min(1, "Please add at least one language."),
});

export const StepInterestsHobbiesSchema = z.object({
  interests: z.array(z.string()).max(30).default([]),
  hobbies: z.array(z.string()).max(30).default([]),
});

export const StepWorkExperienceSchema = ResumeFormSchema.pick({
  experiences: true,
});

export const StepEducationSchema = ResumeFormSchema.pick({
  education: true,
});
