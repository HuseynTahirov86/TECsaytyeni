
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

export interface Aphorism {
  id: string;
  imageUrl: string;
  order: number;
}

const formSchema = z.object({
  order: z.coerce.number().min(1, { message: "Sıra nömrəsi 1-dən kiçik ola bilməz." }).default(100),
  imageUrl: z.string().min(1, { message: "Şəkil yüklənməlidir." }),
});

type FormValues = z.infer<typeof formSchema>;

interface AphorismFormProps {
  onSubmit: (values: Omit<Aphorism, 'id'>, imageFile: File | null) => Promise<void>;
  initialData?: Aphorism | null;
  onClose: () => void;
}

export function AphorismForm({ onSubmit, initialData, onClose }: AphorismFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order: initialData?.order || 100,
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('imageUrl', url, { shouldValidate: true });
    } else {
      setPreviewUrl(null);
      form.setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (!imageFile && !initialData) {
        toast({
            title: "Xəta!",
            description: "Zəhmət olmasa, bir şəkil yükləyin.",
            variant: "destructive",
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
        await onSubmit(values, imageFile);
        form.reset();
        onClose();

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
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aforizm Şəkli</FormLabel>
              <FormControl>
                <ImageUploader 
                  id="aphorism-image"
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
          name="order"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Sıra Nömrəsi</FormLabel>
              <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
              <FormDescription>Kiçik rəqəm daha öndə göstərilir.</FormDescription>
              <FormMessage />
              </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Ləğv Et</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saxlanılır...' : (initialData ? 'Yenilə' : 'Əlavə Et')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
