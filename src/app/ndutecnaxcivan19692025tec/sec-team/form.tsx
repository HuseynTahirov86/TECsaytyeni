
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/image-uploader";

// Renamed from TeamMember to avoid conflicts
export interface SecTeamMember {
  id: string;
  name: string;
  role: string;
  faculty: string;
  bio: string;
  avatarUrl: string;
  avatarHint: string;
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  order: number;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Ad ən azı 2 simvoldan ibarət olmalıdır." }),
  role: z.string().min(2, { message: "Vəzifə ən azı 2 simvoldan ibarət olmalıdır." }),
  faculty: z.string().min(5, { message: "Fakültə adı/Sinif ən azı 5 simvoldan ibarət olmalıdır." }),
  order: z.coerce.number().default(100),
  bio: z.string().min(10, { message: "Bioqrafiya ən azı 10 simvoldan ibarət olmalıdır." }).optional().or(z.literal('')),
  avatarUrl: z.string().url({ message: "Avatar şəkli yüklənməlidir." }),
  avatarHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin (məs., young student)." }),
  linkedinUrl: z.string().url({ message: "Düzgün URL daxil edin" }).or(z.literal('')).optional(),
  instagramUrl: z.string().url({ message: "Düzgün URL daxil edin" }).or(z.literal('')).optional(),
  facebookUrl: z.string().url({ message: "Düzgün URL daxil edin" }).or(z.literal('')).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SecTeamFormProps {
  onSubmit: (values: Omit<SecTeamMember, 'id'>, imageFile: File | null) => Promise<void>;
  initialData?: SecTeamMember | null;
  onClose: () => void;
}

export function SecTeamForm({ onSubmit, initialData, onClose }: SecTeamFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.avatarUrl || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      role: initialData?.role || "",
      faculty: initialData?.faculty || "",
      bio: initialData?.bio || "",
      avatarUrl: initialData?.avatarUrl || "",
      avatarHint: initialData?.avatarHint || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      instagramUrl: initialData?.instagramUrl || "",
      facebookUrl: initialData?.facebookUrl || "",
      order: initialData?.order || 100,
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
      await onSubmit(values as Omit<SecTeamMember, 'id'>, imageFile);
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
            <div className="grid grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                    <FormLabel>Ad və Soyad</FormLabel>
                    <FormControl><Input placeholder="Komanda üzvünün adı" {...field} /></FormControl>
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
                    <FormDescription>Kiçik rəqəm öndə göstərilir.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Vəzifə</FormLabel>
                    <FormControl><Input placeholder="Məs., Sədr, Katib" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
            control={form.control}
            name="faculty"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Sinif / Təhsil Yeri</FormLabel>
                <FormControl><Input placeholder="Məs., Gimnaziya, 10a sinfi" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bioqrafiya (Könüllü)</FormLabel>
                <FormControl><Textarea placeholder="Komanda üzvü haqqında qısa məlumat" {...field} rows={4} /></FormControl>
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
                      id="sec-team-avatar"
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
                <FormControl><Input placeholder="Məs., young student" {...field} /></FormControl>
                <FormDescription>AI üçün ipucu.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <h3 className="text-lg font-medium pt-4 border-t">Sosial Media Linkləri (Könüllü)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl><Input placeholder="LinkedIn profil URL-i" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl><Input placeholder="Instagram profil URL-i" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl><Input placeholder="Facebook profil URL-i" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
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

