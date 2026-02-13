
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

const formSchema = z.object({
  content: z.string().min(20, { message: "Məzmun ən azı 20 simvoldan ibarət olmalıdır." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  initialContent: string;
}

export function ContentForm({ onSubmit, initialContent }: ContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: initialContent || "" },
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Səhifə Məzmunu</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Məqsədləri siyahı şəklində daxil edin..."
                  className="min-h-[400px]"
                />
              </FormControl>
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
