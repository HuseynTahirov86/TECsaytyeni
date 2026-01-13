
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ImageUploader } from "@/components/image-uploader";

export interface ProjectArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  team: string[];
  imageUrl: string;
  imageHint: string;
}

const formSchema = z.object({
  title: z.string().min(10, { message: "Başlıq ən azı 10 simvoldan ibarət olmalıdır." }),
  description: z.string().min(20, { message: "Qısa təsvir ən azı 20 simvoldan ibarət olmalıdır." }),
  content: z.string().min(50, { message: "Ətraflı məzmun ən azı 50 simvoldan ibarət olmalıdır." }),
  team: z.string().min(1, { message: "Komanda üzvlərini daxil edin (vergüllə ayırın)." }),
  imageUrl: z.string().url({ message: "Şəkil yüklənməlidir." }),
  imageHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  onSubmit: (values: Omit<ProjectArticle, 'id'>, imageFile: File | null) => Promise<void>;
  initialData?: ProjectArticle | null;
  onClose: () => void;
}

export function ProjectForm({ onSubmit, initialData, onClose }: ProjectFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: initialData?.title || "",
        description: initialData?.description || "",
        content: initialData?.content || "",
        team: initialData?.team.join(', ') || "",
        imageUrl: initialData?.imageUrl || "",
        imageHint: initialData?.imageHint || "",
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
        toast({ title: "Xəta!", description: "Zəhmət olmasa, bir şəkil yükləyin.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        const slug = generateSlug(values.title);
        const teamArray = values.team.split(',').map(name => name.trim()).filter(name => name.length > 0);
        const dataToSubmit = { ...values, slug, team: teamArray };
        
        await onSubmit(dataToSubmit as Omit<ProjectArticle, 'id'>, imageFile);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-[70vh] min-h-[600px]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pr-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlıq</FormLabel>
                  <FormControl><Input placeholder="Layihə başlığı" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qısa Təsvir</FormLabel>
                  <FormControl><Textarea placeholder="Layihə haqqında qısa məlumat (kartlarda görünəcək)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ətraflı Məzmun (HTML)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Layihənin tam mətni (HTML formatında)" {...field} rows={15} className="font-mono text-sm" />
                  </FormControl>
                  <FormDescription>Mətnə format vermək üçün HTML teqlərindən istifadə edə bilərsiniz (məs., &lt;b&gt;Qalın&lt;/b&gt;, &lt;p&gt;Paraqraf&lt;/p&gt;, &lt;img src='...'&gt;).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Komanda</FormLabel>
                  <FormControl><Input placeholder="Alisa Cabbarlı, Babək Vəliyev" {...field} /></FormControl>
                  <FormDescription>Komanda üzvlərinin adlarını vergüllə ayırın.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layihə Şəkli</FormLabel>
                   <FormControl>
                        <ImageUploader 
                          id="project-image"
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
            name="imageHint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Şəkil Açar Sözü</FormLabel>
                <FormControl><Input placeholder="Məs., climate model, prosthetic hand" {...field} /></FormControl>
                <FormDescription>Bu, süni intellektin uyğun şəkil tapmasına kömək edir.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Ləğv Et</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saxlanılır...' : (initialData ? 'Yenilə' : 'Əlavə Et')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
