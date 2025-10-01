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
import { StepInterestsHobbiesSchema } from "@/lib/types";

export default function Step4() {
  const { data, merge, next, prev } = useFormStore();

  const [interestInput, setInterestInput] = React.useState("");
  const [hobbyInput, setHobbyInput] = React.useState("");

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(StepInterestsHobbiesSchema),
    defaultValues: {
      interests: data.interests || [],
      hobbies: data.hobbies || [],
    },
  });

  const addInterest = () => {
    if (!interestInput.trim()) return;
    const nextArr = [...data.interests, interestInput.trim()];
    setInterestInput("");
    form.setValue("interests", nextArr);
    merge({ interests: nextArr });
  };

  const removeInterest = (idx: number) => {
    const nextArr = data.interests.filter((_, i) => i !== idx);
    form.setValue("interests", nextArr);
    merge({ interests: nextArr });
  };

  const addHobby = () => {
    if (!hobbyInput.trim()) return;
    const nextArr = [...data.hobbies, hobbyInput.trim()];
    setHobbyInput("");
    form.setValue("hobbies", nextArr);
    merge({ hobbies: nextArr });
  };

  const removeHobby = (idx: number) => {
    const nextArr = data.hobbies.filter((_, i) => i !== idx);
    form.setValue("hobbies", nextArr);
    merge({ hobbies: nextArr });
  };

  const onSubmit = () => {
    setSubmitError(null);

    const parsed = StepInterestsHobbiesSchema.safeParse({
      interests: data.interests,
      hobbies: data.hobbies,
    });
    if (!parsed.success) {
      form.trigger(); // Trigger field-level validations
      setSubmitError("Please correct the interests and hobbies details.");
      return;
    }
    next();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Interests & Hobbies
        </h2>
        <p className="text-sm text-muted-foreground">
          List your interests and hobbies.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => onSubmit())}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Add an interest</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Interest"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
              />
              <Button type="button" onClick={addInterest}>
                Add interest
              </Button>
            </div>

            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <div className="space-y-2">
                    {data.interests.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No interests added yet.
                      </p>
                    )}
                    {data.interests.map((interest, i) => (
                      <div
                        key={`${interest}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                      >
                        <span className="text-sm">{interest}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInterest(i)}
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
            <h3 className="text-sm font-medium">Add a hobby</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Hobby"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
              />
              <Button type="button" onClick={addHobby}>
                Add hobby
              </Button>
            </div>

            <FormField
              control={form.control}
              name="hobbies"
              render={() => (
                <FormItem>
                  <FormLabel>Hobbies</FormLabel>
                  <div className="space-y-2">
                    {data.hobbies.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No hobbies added yet.
                      </p>
                    )}
                    {data.hobbies.map((hobby, i) => (
                      <div
                        key={`${hobby}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                      >
                        <span className="text-sm">{hobby}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHobby(i)}
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
