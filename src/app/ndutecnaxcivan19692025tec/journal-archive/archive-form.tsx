
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ImageUploader } from "@/components/image-uploader";
import { FileUploader } from "@/components/file-uploader";

export interface JournalArchive {
  id: string;
  title: string;
  journalType: 'science' | 'law';
  fileUrl: string;
  imageUrl: string;
}

const formSchema = z.object({
  title: z.string().min(5, { message: "Başlıq ən azı 5 simvoldan ibarət olmalıdır." }),
  journalType: z.enum(["science", "law"], { required_error: "Zəhmət olmasa, jurnal növünü seçin." }),
  fileUrl: z.string().min(1, { message: "Jurnal faylı yüklənməlidir." }),
  imageUrl: z.string().min(1, { message: "Üz qabığı şəkli yüklənməlidir." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ArchiveFormProps {
  onSubmit: (values: Omit<JournalArchive, 'id'>, imageFile: File | null, docFile: File | null) => Promise<void>;
  initialData?: JournalArchive | null;
  onClose: () => void;
}

export function ArchiveForm({ onSubmit, initialData, onClose }: ArchiveFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      journalType: initialData?.journalType,
      fileUrl: initialData?.fileUrl || "",
      imageUrl: initialData?.imageUrl || "",
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
        toast({ title: "Xəta!", description: "Zəhmət olmasa, jurnal faylını yükləyin.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        await onSubmit(values as Omit<JournalArchive, 'id'>, imageFile, docFile);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pr-2">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Başlıq</FormLabel>
                    <FormControl><Input placeholder="Jurnalın buraxılış adı (məs, 2024, I Buraxılış)" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
               
                <FormField
                    control={form.control}
                    name="journalType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Jurnal Növü</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Jurnal növünü seçin" /></SelectTrigger></FormControl>
                        <SelectContent>
                           <SelectItem value="science">Tələbə Elmi Jurnalı</SelectItem>
                           <SelectItem value="law">Tələbə Hüquq Jurnalı</SelectItem>
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
                      <FormLabel>Jurnal Faylı</FormLabel>
                        <FormControl>
                            <FileUploader id="journal-file" onFileSelect={handleDocFile} initialUrl={initialData?.fileUrl} acceptedTypes={['.pdf']} />
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
                          <ImageUploader id="journal-image" onFileSelect={handleImageFile} previewUrl={imagePreview} onRemove={() => { setImagePreview(null); field.onChange("") }}/>
                      </FormControl>
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
