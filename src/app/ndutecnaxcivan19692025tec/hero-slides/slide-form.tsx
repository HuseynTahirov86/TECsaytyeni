
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface HeroSlide {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
  type: 'main' | 'image';
}

const formSchema = z.object({
  title: z.string().optional(),
  order: z.coerce.number().min(1, { message: "Sıra nömrəsi 1-dən kiçik ola bilməz." }).default(100),
  imageUrl: z.string().min(1, { message: "Şəkil yüklənməlidir." }),
  type: z.enum(['main', 'image'], { required_error: 'Slayd növünü seçin.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface HeroSlideFormProps {
  onSubmit: (values: Omit<HeroSlide, 'id'>, imageFile: File | null) => Promise<void>;
  initialData?: HeroSlide | null;
  onClose: () => void;
}

export function HeroSlideForm({ onSubmit, initialData, onClose }: HeroSlideFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      order: initialData?.order || 100,
      imageUrl: initialData?.imageUrl || "",
      type: initialData?.type || 'image',
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
        await onSubmit(values as Omit<HeroSlide, 'id'>, imageFile);
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
              <FormLabel>Slayd Şəkli</FormLabel>
               <FormControl>
                <ImageUploader 
                  id="slide-image"
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
          name="title"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Başlıq (Könüllü)</FormLabel>
              <FormControl><Input placeholder="Slayd üçün daxili başlıq..." {...field} /></FormControl>
              <FormDescription>Bu başlıq yalnız admin panel üçün nəzərdə tutulub.</FormDescription>
              <FormMessage />
              </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
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
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Slayd Növü</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Slayd növünü seçin" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="main">Əsas Slayd (Yazı və düymələr görünəcək)</SelectItem>
                            <SelectItem value="image">Şəkil Slaydı (Yalnız şəkil)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
       
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
