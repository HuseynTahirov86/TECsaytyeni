"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

export interface SecAboutContent {
  title: string;
  mainContent: string;
}

const formSchema = z.object({
  title: z.string().min(10, { message: "Başlıq ən azı 10 simvoldan ibarət olmalıdır." }),
  mainContent: z.string().min(50, { message: "Əsas məzmun ən azı 50 simvoldan ibarət olmalıdır." }),
});

type FormValues = z.infer<typeof formSchema>;

interface SecAboutContentFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  initialData: FormValues | null;
}

export function SecAboutContentForm({ onSubmit, initialData }: SecAboutContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "NDU nəzdində Gimnaziya Şagird Elmi Cəmiyyəti (ŞEC)",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Səhifə Başlığı</FormLabel>
              <FormControl>
                <Input placeholder="Səhifənin əsas başlığı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mainContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Əsas Məzmun (Tarixçə)</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="ŞEC haqqında əsas məlumat..."
                  className="min-h-[300px]"
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
