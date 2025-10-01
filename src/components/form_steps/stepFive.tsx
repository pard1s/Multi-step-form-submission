"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "@/lib/store";
import {
  StepEducationSchema,
  EducationItemSchema,
  StepAddressSchema,
} from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type AddressData = z.infer<typeof StepAddressSchema>;
type EducationData = { education: z.infer<typeof EducationItemSchema>[] };

export default function Step5() {
  const { data, merge, prev } = useFormStore();

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(StepAddressSchema),
    defaultValues: {
      street: data.street || "",
      city: data.city || "",
      state: data.state || "",
      postalCode: data.postalCode || "",
      country: data.country || "",
    },
  });

  const eduForm = useForm<EducationData>({
    resolver: zodResolver(StepEducationSchema),
    defaultValues: { education: data.education || [] },
  });

  const [education, setEducation] = React.useState<
    z.infer<typeof EducationItemSchema>[]
  >(
    data.education.map((item) => ({
      ...item,
      startDate: item.startDate ? item.startDate.toString() : "",
      endDate: item.endDate ? item.endDate.toString() : "",
    }))
  );

  const addEducation = () => {
    setEducation((p) => [
      ...p,
      { school: "", degree: "", field: "", startDate: "", endDate: "" },
    ]);
  };

  const updateEducation = (idx: number, key: string, value: any) => {
    setEducation((p) =>
      p.map((it, i) => (i === idx ? { ...it, [key]: value } : it))
    );
  };

  const removeEducation = (idx: number) => {
    setEducation((p) => p.filter((_, i) => i !== idx));
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const addressValues = addressForm.getValues();
    const parsedAddress = StepAddressSchema.safeParse(addressValues);
    const parsedEdu = StepEducationSchema.safeParse({
      education: education.map((item) => ({
        ...item,
        startDate: item.startDate,
        endDate: item.endDate,
      })),
    });

    if (!parsedAddress.success) {
      addressForm.trigger();
      setError("Please correct the address details.");
      setIsLoading(false);
      return;
    }

    if (!parsedEdu.success) {
      setError("Please ensure all education fields are valid.");
      setIsLoading(false);
      return;
    }

    const finalData = {
      ...data,
      street: parsedAddress.data.street,
      city: parsedAddress.data.city,
      state: parsedAddress.data.state,
      postalCode: parsedAddress.data.postalCode,
      country: parsedAddress.data.country,
      education: parsedEdu.data.education,
    };
    merge(finalData);

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        setError(errorData.message || "Failed to submit form.");
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      console.log("Attempting to open success dialog.");
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error("Network error or unexpected:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("multistep_form_data");
    }
    useFormStore.getState().reset();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Address & Education
        </h2>
        <p className="text-sm text-muted-foreground">
          Confirm address and list schools.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-8">
        <Form {...addressForm}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={addressForm.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={addressForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressForm.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <Form {...eduForm}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={addEducation}>
                Add education
              </Button>
            </div>

            {education.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No education added yet.
              </p>
            )}

            {education.map((ed, idx) => (
              <div key={idx} className="space-y-3 rounded-md border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <FormLabel>School</FormLabel>
                    <Input
                      value={ed.school}
                      onChange={(e) =>
                        updateEducation(idx, "school", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FormLabel>Degree</FormLabel>
                    <Input
                      value={ed.degree}
                      onChange={(e) =>
                        updateEducation(idx, "degree", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <FormLabel>Field</FormLabel>
                    <Input
                      value={ed.field}
                      onChange={(e) =>
                        updateEducation(idx, "field", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FormLabel>Start date</FormLabel>
                    <Input
                      value={ed.startDate}
                      onChange={(e) =>
                        updateEducation(idx, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FormLabel>End date</FormLabel>
                    <Input
                      value={ed.endDate ?? ""}
                      onChange={(e) =>
                        updateEducation(idx, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(idx)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <FormField
              control={eduForm.control}
              name="education"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex items-center gap-3 pt-2">
          <Button type="button" variant="outline" onClick={prev}>
            Back
          </Button>
          <Button
            type="button"
            className="ml-auto"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Successful!</DialogTitle>
            <DialogDescription>
              Your multi-step form has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={handleSuccessDialogClose}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
