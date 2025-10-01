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
import { EducationItemSchema } from "@/lib/types";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parseISO } from "date-fns";

interface EducationFormProps {
  education: z.infer<typeof EducationItemSchema>;
  onSave: (updatedEdu: z.infer<typeof EducationItemSchema>) => void;
  onCancel: () => void;
  onRemove: () => void;
}

export function EducationForm({
  education,
  onSave,
  onCancel,
  onRemove,
}: EducationFormProps) {
  const form = useForm<z.infer<typeof EducationItemSchema>>({
    resolver: zodResolver(EducationItemSchema),
    defaultValues: {
      ...education,
      startDate: education.startDate
        ? format(parseISO(education.startDate), "yyyy-MM-dd")
        : "",
      endDate: education.endDate
        ? format(parseISO(education.endDate), "yyyy-MM-dd")
        : "",
    },
  });

  const onSubmit = (values: z.infer<typeof EducationItemSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  School <span className="text-red-500">*</span>
                </FormLabel>
                <Input required placeholder="University Name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Degree <span className="text-red-500">*</span>
                </FormLabel>
                <Input required placeholder="e.g. Bachelor's" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Field <span className="text-red-500">*</span>
                </FormLabel>
                <Input
                  required
                  placeholder="e.g. Computer Science"
                  {...field}
                />
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
                  value={field.value ? parseISO(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(
                      date ? format(date, "yyyy-MM-dd") : undefined
                    )
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
                  value={field.value ? parseISO(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(
                      date ? format(date, "yyyy-MM-dd") : undefined
                    )
                  }
                  placeholder="Select end date"
                  disabled={(date) =>
                    field.value ? date < parseISO(field.value) : false
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
