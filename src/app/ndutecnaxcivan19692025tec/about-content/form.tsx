
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AboutContent {
  historyContent: string;
  visionContent: string;
  missionContent: string;
  valuesContent: string;
  goalsContent: string;
}

const formSchema = z.object({
  historyContent: z.string().min(50, { message: "Tarixçə məzmunu ən azı 50 simvoldan ibarət olmalıdır." }),
  visionContent: z.string().min(20, { message: "Vizyon mətni ən azı 20 simvoldan ibarət olmalıdır." }),
  missionContent: z.string().min(20, { message: "Fəaliyyət istiqamətləri mətni ən azı 20 simvoldan ibarət olmalıdır." }),
  valuesContent: z.string().min(20, { message: "Dəyərlər mətni ən azı 20 simvoldan ibarət olmalıdır." }),
  goalsContent: z.string().min(20, { message: "Məqsədlər mətni ən azı 20 simvoldan ibarət olmalıdır." }),
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
      historyContent: "",
      visionContent: "",
      missionContent: "",
      valuesContent: "",
      goalsContent: ""
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
        <Card>
            <CardHeader><CardTitle>Tariximiz</CardTitle></CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="historyContent"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="TEC-in tarixi haqqında məlumat..."
                        className="min-h-[300px]"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Vizyonumuz</CardTitle></CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="visionContent"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Vizyon mətni..."
                        className="min-h-[100px]"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Əsas Fəaliyyət İstiqamətlərimiz</CardTitle></CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="missionContent"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Fəaliyyət istiqamətlərini siyahı şəklində daxil edin..."
                        className="min-h-[200px]"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>

         <Card>
            <CardHeader><CardTitle>Dəyər və Prinsiplərimiz</CardTitle></CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="valuesContent"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Dəyərləri siyahı şəklində daxil edin..."
                        className="min-h-[200px]"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Strateji Məqsədlərimiz</CardTitle></CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="goalsContent"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Məqsədləri siyahı şəklində daxil edin..."
                        className="min-h-[200px]"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>
       
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saxlanılır...' : 'Məzmunu Yadda Saxla'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
