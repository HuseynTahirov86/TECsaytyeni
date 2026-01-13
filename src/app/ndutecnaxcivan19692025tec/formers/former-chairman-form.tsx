
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/image-uploader";

export interface FormerChairman {
  id: string;
  name: string;
  period: string;
  bio: string;
  avatarUrl: string;
  avatarHint: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Ad ən azı 2 simvoldan ibarət olmalıdır." }),
  period: z.string().min(4, { message: "Vəzifə dövrü ən azı 4 simvoldan ibarət olmalıdır." }),
  bio: z.string().min(20, { message: "Bioqrafiya ən azı 20 simvoldan ibarət olmalıdır." }),
  avatarUrl: z.string().url({ message: "Avatar şəkli yüklənməlidir." }),
  avatarHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin (məs., male student)." }),
});

type FormValues = z.infer<typeof formSchema>;

interface FormerChairmanFormProps {
  onSubmit: (values: Omit<FormerChairman, 'id'>, imageFile: File | null) => Promise<void>;
  initialData?: FormerChairman | null;
  onClose: () => void;
}

export function FormerChairmanForm({ onSubmit, initialData, onClose }: FormerChairmanFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.avatarUrl || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      period: initialData?.period || "",
      bio: initialData?.bio || "",
      avatarUrl: initialData?.avatarUrl || "",
      avatarHint: initialData?.avatarHint || "",
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
    if (!imageFile && !initialData) {
        toast({ title: "Xəta!", description: "Zəhmət olmasa, bir avatar şəkli yükləyin.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        await onSubmit(values as Omit<FormerChairman, 'id'>, imageFile);
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
                <div className="grid grid-cols-2 gap-4">
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
                    name="period"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Vəzifə Dövrü</FormLabel>
                        <FormControl><Input placeholder="Məs., 2020-2022" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                 <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bioqrafiya</FormLabel>
                        <FormControl><Textarea placeholder="Sədr haqqında ətraflı məlumat..." {...field} rows={5} /></FormControl>
                         <FormDescription>Bu mətn detallı görünüşdə göstəriləcək.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                 <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar Şəkli</FormLabel>
                      <FormControl>
                        <ImageUploader 
                          id="former-chairman-avatar"
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
                name="avatarHint"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Şəkil Açar Sözü</FormLabel>
                    <FormControl><Input placeholder="Məs., former chairman" {...field} /></FormControl>
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
