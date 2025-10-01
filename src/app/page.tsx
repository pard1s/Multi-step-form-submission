"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Step1 from "@/components/form_steps/stepOne";
import Step2 from "@/components/form_steps/stepTwo";
import Step3 from "@/components/form_steps/stepThree";
import Step4 from "@/components/form_steps/stepFour";
import Step5 from "@/components/form_steps/stepFive";
import { useFormStore } from "@/lib/store";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { stepIndex, steps } = useFormStore();
  const prevIndexRef = useRef(stepIndex);
  const [transitionDirection, setTransitionDirection] = useState(1); // 1 for next, -1 for prev

  useEffect(() => {
    const prev = prevIndexRef.current;
    const newDirection = stepIndex > prev ? 1 : -1;
    prevIndexRef.current = stepIndex;
    setTransitionDirection(newDirection);
  }, [stepIndex]);

  const StepComponent = useMemo(() => {
    switch (steps[stepIndex]) {
      case "personal":
        return Step1;
      case "skills_languages":
        return Step2;
      case "work_experience":
        return Step3;
      case "interests_hobbies":
        return Step4;
      default:
        return Step5;
    }
  }, [stepIndex, steps]);

  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen w-full px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-3xl space-y-6 p-6 overflow-hidden">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Multi-step Form
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Step {stepIndex + 1} of {steps.length}
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>

        <CardContent className="px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: transitionDirection === 1 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: transitionDirection === 1 ? -50 : 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative min-h-[420px] overflow-hidden"
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
