"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ImageUploader } from "@/components/image-uploader";
import { Textarea } from "@/components/ui/textarea";

export interface Chairman {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  avatarHint: string;
  linkedinUrl: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Ad ən azı 2 simvoldan ibarət olmalıdır." }),
  role: z.string().min(2, { message: "Vəzifə ən azı 2 simvoldan ibarət olmalıdır." }),
  bio: z.string().min(20, { message: "Bioqrafiya ən azı 20 simvoldan ibarət olmalıdır." }),
  avatarUrl: z.string().min(1, { message: "Avatar şəkli yüklənməlidir." }),
  avatarHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin (məs., male student)." }),
  linkedinUrl: z.string().url({ message: "Düzgün URL daxil edin" }).or(z.literal('')).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ChairmanFormProps {
  onSubmit: (values: FormValues, imageFile: File | null) => Promise<void>;
  initialData: FormValues | null;
}

export function ChairmanForm({ onSubmit, initialData }: ChairmanFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.avatarUrl || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      role: "Sədr",
      bio: "",
      avatarUrl: "",
      avatarHint: "",
      linkedinUrl: "",
    },
  });

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('avatarUrl', url, { shouldValidate: true });
    } else {
      setPreviewUrl(null);
      form.setValue('avatarUrl', '', { shouldValidate: true });
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, imageFile);
    } catch (error: any) {
      toast({
        title: "Xəta!",
        description: error.message || "Məlumatları saxlayarkən problem yarandı.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sədrin Şəkli</FormLabel>
              <FormControl>
                <ImageUploader 
                  id="chairman-avatar"
                  onFileSelect={handleFileSelect}
                  previewUrl={previewUrl}
                  onRemove={() => {
                      setPreviewUrl(null);
                      field.onChange("");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad və Soyad</FormLabel>
              <FormControl><Input placeholder="Sədrin adı" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vəzifə</FormLabel>
              <FormControl><Input {...field} disabled /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bioqrafiya</FormLabel>
              <FormControl><Textarea placeholder="Sədr haqqında məlumat" {...field} rows={5} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profili</FormLabel>
              <FormControl><Input placeholder="https://linkedin.com/in/username" {...field} value={field.value || ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şəkil Açar Sözü</FormLabel>
              <FormControl><Input placeholder="Məs., male student" {...field} /></FormControl>
              <FormDescription>AI üçün ipucu.</FormDescription>
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
