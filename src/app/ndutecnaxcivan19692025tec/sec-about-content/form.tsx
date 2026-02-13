"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUploader } from "@/components/image-uploader";

export interface SecAboutContent {
  title: string;
  bannerImageUrl: string;
  bannerImageHint: string;
  mainContent: string;
}

const formSchema = z.object({
  title: z.string().min(10, { message: "Başlıq ən azı 10 simvoldan ibarət olmalıdır." }),
  bannerImageUrl: z.string().min(1, { message: "Banner şəkli yüklənməlidir." }),
  bannerImageHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin." }),
  mainContent: z.string().min(50, { message: "Əsas məzmun ən azı 50 simvoldan ibarət olmalıdır." }),
});

type FormValues = z.infer<typeof formSchema>;

interface SecAboutContentFormProps {
  onSubmit: (values: FormValues, imageFile: File | null) => Promise<void>;
  initialData: FormValues | null;
}

export function SecAboutContentForm({ onSubmit, initialData }: SecAboutContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.bannerImageUrl || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "NDU nəzdində Gimnaziya Şagird Elmi Cəmiyyəti (ŞEC)",
      bannerImageUrl: "",
      bannerImageHint: "group young students science project",
      mainContent: "",
    },
  });

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('bannerImageUrl', url, { shouldValidate: true });
    } else {
      setPreviewUrl(null);
      form.setValue('bannerImageUrl', '', { shouldValidate: true });
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(values, imageFile);
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
          name="bannerImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Şəkli</FormLabel>
              <FormControl>
                <ImageUploader 
                  id="sec-banner-image"
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
          name="bannerImageHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Şəkli Açar Sözü</FormLabel>
              <FormControl><Input placeholder="Məs., young students" {...field} /></FormControl>
              <FormDescription>AI üçün ipucu.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mainContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Əsas Məzmun</FormLabel>
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
