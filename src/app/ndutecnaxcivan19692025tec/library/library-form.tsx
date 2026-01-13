
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { libraryCategories } from "@/lib/placeholder-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ImageUploader } from "@/components/image-uploader";
import { FileUploader } from "@/components/file-uploader";
import { RichTextEditor } from "@/components/rich-text-editor";

export interface LibraryEntry {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  fileUrl: string;
  imageUrl: string;
  imageHint: string;
}

const formSchema = z.object({
  title: z.string().min(5, { message: "Başlıq ən azı 5 simvoldan ibarət olmalıdır." }),
  description: z.string().min(20, { message: "Təsvir ən azı 20 simvoldan ibarət olmalıdır." }),
  category: z.string({ required_error: "Zəhmət olmasa, bir kateqoriya seçin." }),
  fileUrl: z.string().min(1, { message: "Fayl yüklənməlidir." }),
  imageUrl: z.string().min(1, { message: "Şəkil yüklənməlidir." }),
  imageHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin." }),
});

type FormValues = z.infer<typeof formSchema>;

interface LibraryFormProps {
  onSubmit: (values: Omit<LibraryEntry, 'id'>, imageFile: File | null, docFile: File | null) => Promise<void>;
  initialData?: LibraryEntry | null;
  onClose: () => void;
}

export function LibraryForm({ onSubmit, initialData, onClose }: LibraryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      fileUrl: initialData?.fileUrl || "",
      imageUrl: initialData?.imageUrl || "",
      imageHint: initialData?.imageHint || "",
    },
  });

  const handleImageFile = (file: File | null) => {
    setImageFile(file);
    if(file){
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      form.setValue('imageUrl', url, { shouldValidate: true });
    } else {
      setImagePreview(null);
      form.setValue('imageUrl', '', { shouldValidate: true });
    }
  }

  const handleDocFile = (file: File | null) => {
    setDocFile(file);
    if(file){
      form.setValue('fileUrl', file.name, { shouldValidate: true });
    } else {
       form.setValue('fileUrl', '', { shouldValidate: true });
    }
  }

  const handleSubmit = async (values: FormValues) => {
    if (!imageFile && !initialData?.imageUrl) {
        toast({ title: "Xəta!", description: "Zəhmət olmasa, üz qabığı şəklini yükləyin.", variant: "destructive" });
        return;
    }
    if (!docFile && !initialData?.fileUrl) {
        toast({ title: "Xəta!", description: "Zəhmət olmasa, material faylını yükləyin.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    try {
        await onSubmit(values as Omit<LibraryEntry, 'id'>, imageFile, docFile);
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
                    <FormControl><Input placeholder="Kitabın və ya məqalənin adı" {...field} /></FormControl>
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
                    <FormControl><RichTextEditor placeholder="Material haqqında qısa məlumat..." {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
               
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Kateqoriya</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Kateqoriya seçin" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {libraryCategories.filter(c => c !== "Bütün").map(category => (
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
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Faylı</FormLabel>
                        <FormControl>
                            <FileUploader id="library-file" onFileSelect={handleDocFile} initialUrl={initialData?.fileUrl} acceptedTypes={['.pdf', '.doc', '.docx']} />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Üz Qabığı Şəkli</FormLabel>
                       <FormControl>
                          <ImageUploader id="library-image" onFileSelect={handleImageFile} previewUrl={imagePreview} onRemove={() => { setImagePreview(null); field.onChange("") }}/>
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
                    <FormControl><Input placeholder="Məs., old book, science journal" {...field} /></FormControl>
                    <FormDescription>AI üçün ipucu.</FormDescription>
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
