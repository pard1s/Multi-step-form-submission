import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ResumeFormData } from "./types";

export type FormStep =
  | "personal"
  | "skills_languages"
  | "work_experience"
  | "interests_hobbies";

const stepsOrder: FormStep[] = [
  "personal",
  "skills_languages",
  "work_experience",
  "interests_hobbies",
];

const emptyState: ResumeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  website: undefined,
  facebook: undefined,
  instagram: undefined,
  linkedin: undefined,
  skills: [],
  languages: [],
  interests: [],
  hobbies: [],
  experiences: [],
  education: [],
};

type FormStore = {
  data: ResumeFormData;
  stepIndex: number;
  steps: FormStep[];
  // navigation
  next: () => void;
  prev: () => void;
  goTo: (step: FormStep) => void;
  reset: () => void;
  merge: (partial: Partial<ResumeFormData>) => void;
};

const STORAGE_KEY = "multistep_form_data";

export const useFormStore = create<FormStore>()(
  immer((set, _get) => ({
    data: {
      ...emptyState,
      ...(typeof window !== "undefined" &&
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")), //saving and reading steps data to avoid data loss during page refresh
    },
    stepIndex: 0,
    steps: stepsOrder,
    next: () =>
      set((state) => {
        const nextIndex = Math.min(state.stepIndex + 1, state.steps.length - 1);
        state.stepIndex = nextIndex;
      }),
    prev: () =>
      set((state) => {
        const prevIndex = Math.max(state.stepIndex - 1, 0);
        state.stepIndex = prevIndex;
      }),
    goTo: (step) =>
      set((state) => {
        const idx = state.steps.indexOf(step);
        if (idx !== -1) state.stepIndex = idx;
      }),
    reset: () =>
      set((state) => {
        state.data = emptyState;
        state.stepIndex = 0;
      }),
    merge: (partial) =>
      set((state) => {
        state.data = { ...state.data, ...partial } as ResumeFormData;
      }),
  }))
);

useFormStore.subscribe((state) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  }
});

export const useCurrentStep = () => {
  const { stepIndex, steps } = useFormStore.getState();
  return steps[stepIndex];
};
