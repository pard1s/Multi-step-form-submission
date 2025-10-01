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
import { StepAddressSchema } from "@/lib/types";
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

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const addressValues = addressForm.getValues();
    const parsedAddress = StepAddressSchema.safeParse(addressValues);

    if (!parsedAddress.success) {
      addressForm.trigger();
      setError("Please correct the address details.");
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
        <h2 className="text-2xl font-semibold tracking-tight">Address</h2>
        <p className="text-sm text-muted-foreground">
          Confirm your address details.
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
                    <FormLabel>
                      Street <span className="text-red-500">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" required {...field} />
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
                    <FormLabel>
                      City <span className="text-red-500">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="City" required {...field} />
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
                    <FormLabel>
                      State/Province{" "}
                      <span className="text-red-500">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="State" required {...field} />
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
                    <FormLabel>
                      Postal code <span className="text-red-500">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="12345" required {...field} />
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
                    <FormLabel>
                      Country <span className="text-red-500">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Country" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
