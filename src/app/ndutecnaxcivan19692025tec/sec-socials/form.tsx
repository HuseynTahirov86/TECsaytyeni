"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Instagram, Facebook } from "lucide-react";

export interface SecSocialLinks {
  facebook: string;
  instagram: string;
}

const formSchema = z.object({
  facebook: z.string().url({ message: "Zəhmət olmasa, düzgün bir Facebook URL daxil edin." }).or(z.literal('')),
  instagram: z.string().url({ message: "Zəhmət olmasa, düzgün bir Instagram URL daxil edin." }).or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface SecSocialsFormProps {
  onSubmit: (values: FormValues) => void;
  initialData: SecSocialLinks | null;
}

export function SecSocialsForm({ onSubmit, initialData }: SecSocialsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Facebook className="h-4 w-4 mr-2" /> Facebook</FormLabel>
              <FormControl><Input placeholder="https://facebook.com/username" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Instagram className="h-4 w-4 mr-2" /> Instagram</FormLabel>
              <FormControl><Input placeholder="https://instagram.com/username" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
