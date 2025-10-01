"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { WorkExperienceSchema } from "@/lib/types";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

interface ExperienceFormProps {
  experience: z.infer<typeof WorkExperienceSchema>;
  onSave: (updatedExp: z.infer<typeof WorkExperienceSchema>) => void;
  onCancel: () => void;
  onRemove: () => void;
}

export function ExperienceForm({
  experience,
  onSave,
  onCancel,
  onRemove,
}: ExperienceFormProps) {
  const form = useForm<z.infer<typeof WorkExperienceSchema>>({
    resolver: zodResolver(WorkExperienceSchema),
    defaultValues: {
      ...experience,
      startDate: experience.startDate
        ? format(new Date(experience.startDate), "yyyy-MM-dd")
        : "",
      endDate: experience.endDate
        ? format(new Date(experience.endDate), "yyyy-MM-dd")
        : "",
    },
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
                <FormLabel>
                  Company <span className="text-red-500">*</span>
                </FormLabel>
                <Input required placeholder="Company Name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <Input required placeholder="Job Title" {...field} />
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
                <FormLabel>
                  Location <span className="text-red-500">*</span>
                </FormLabel>
                <Input required placeholder="City, Country" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Start Date <span className="text-red-500">*</span>
                </FormLabel>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                  }
                  placeholder="Select start date"
                />
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
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                  }
                  placeholder="Select end date"
                  disabled={(date) =>
                    field.value ? date < new Date(field.value) : false
                  }
                />
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
