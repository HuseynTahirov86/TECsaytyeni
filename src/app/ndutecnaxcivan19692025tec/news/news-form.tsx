
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { blogCategories } from "@/lib/placeholder-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ImageUploader } from "@/components/image-uploader";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  date: string;
  imageUrl: string;
  imageHint: string;
}

const formSchema = z.object({
  title: z.string().min(10, { message: "Başlıq ən azı 10 simvoldan ibarət olmalıdır." }),
  description: z.string().min(20, { message: "Qısa təsvir ən azı 20 simvoldan ibarət olmalıdır." }),
  content: z.string().min(50, { message: "Ətraflı məzmun ən azı 50 simvoldan ibarət olmalıdır." }),
  category: z.string({ required_error: "Zəhmət olmasa, bir kateqoriya seçin." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Düzgün tarix daxil edin." }),
  imageUrl: z.string().url({ message: "Şəkil yüklənməlidir." }),
  imageHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin." }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
  onSubmit: (values: Omit<NewsArticle, 'id'>, imageFile: File | null) => Promise<void>;
  initialData?: NewsArticle | null;
  onClose: () => void;
}

export function NewsForm({ onSubmit, initialData, onClose }: NewsFormProps) {
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
      category: initialData?.category || "",
      date: initialData?.date || new Date().toISOString().split('T')[0],
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
        toast({
            title: "Xəta!",
            description: "Zəhmət olmasa, bir şəkil yükləyin.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);
    try {
        await onSubmit(values as Omit<NewsArticle, 'id'>, imageFile);
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
                    <FormControl><Input placeholder="Xəbər başlığı" {...field} /></FormControl>
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
                    <FormControl><Textarea placeholder="Xəbərin anonsu və ya qısa xülasəsi" {...field} /></FormControl>
                    <FormDescription>Bu mətn kartlarda görünəcək.</FormDescription>
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
                        <Textarea placeholder="Xəbərin tam mətni (HTML formatında)" {...field} rows={15} className="font-mono text-sm" />
                    </FormControl>
                    <FormDescription>Mətnə format vermək üçün HTML teqlərindən istifadə edə bilərsiniz (məs., &lt;b&gt;Qalın&lt;/b&gt;, &lt;p&gt;Paraqraf&lt;/p&gt;, &lt;img src='...'&gt;).</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Kateqoriya</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Kateqoriya seçin" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {blogCategories.filter(c => c !== "Bütün").map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tarix</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Əsas Şəkil</FormLabel>
                          <FormControl>
                            <ImageUploader 
                              id="news-image"
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
                    <FormControl><Input placeholder="Məs., conference, robotics" {...field} /></FormControl>
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
