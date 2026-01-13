
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { faculties } from "@/lib/placeholder-data";
import { FileUploader } from "@/components/file-uploader";
import { uploadFile } from "@/lib/utils";

const formSchema = z.object({
  faculty: z.string({ required_error: "Fakültə seçilməlidir." }),
  documentType: z.string({ required_error: "Sənəd növü seçilməlidir." }),
});

type FormValues = z.infer<typeof formSchema>;

export function FacultyDocumentForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    if (!documentFile) {
        toast({ title: "Xəta!", description: "Sənəd faylını yükləməlisiniz.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
      const fileUrl = await uploadFile(documentFile, "fakultecixaris");
      await addDoc(collection(db, "facultyDocuments"), {
        ...values,
        fileUrl: fileUrl,
        submittedAt: serverTimestamp(),
      });

      toast({
        title: "Sənəd Göndərildi!",
        description: "Sənədiniz uğurla sistemə yükləndi.",
      });
      form.reset();
      setDocumentFile(null); // Clear the file input state
    } catch (error: any) {
      console.error("Error submitting document: ", error);
      toast({
        title: "Xəta!",
        description: error.message || "Sənəd göndərilərkən bir problem yarandı.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fakültə Seçin *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sənədi təqdim edən fakültə" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sənədin Təyinatı *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sənədin təyinatını seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="TETİ nəticələri ilə bağlı Fakültə Elmi Şurasının protokolundan çıxarış">TETİ nəticələri ilə bağlı Fakültə Elmi Şurasının protokolundan çıxarış</SelectItem>
                    <SelectItem value="Müxtəlif təyinatlı sənəd">Müxtəlif təyinatlı sənəd</SelectItem>
                </SelectContent>
              </Select>
               <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>Protokol Faylı *</FormLabel>
          <FileUploader 
            id="faculty-protocol-file"
            onFileSelect={setDocumentFile}
          />
        </FormItem>
        
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Göndərilir...' : 'Sənədi Göndər'}
        </Button>
      </form>
    </Form>
  );
}
