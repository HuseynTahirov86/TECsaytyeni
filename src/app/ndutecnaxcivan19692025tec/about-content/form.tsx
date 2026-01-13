
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

export interface AboutContent {
  mainContent: string;
}

const formSchema = z.object({
  mainContent: z.string().min(50, { message: "Məzmun ən azı 50 simvoldan ibarət olmalıdır." }),
});

type FormValues = z.infer<typeof formSchema>;

interface AboutContentFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  initialData: FormValues | null;
}

export function AboutContentForm({ onSubmit, initialData }: AboutContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      mainContent: "",
    },
  });

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
          name="mainContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Səhifənin Əsas Məzmunu</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Haqqımızda səhifəsinin mətnini daxil edin..."
                  className="min-h-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saxlanılır...' : 'Məzmunu Yadda Saxla'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
