
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
import { departmentList } from "@/lib/placeholder-data";
import { FileUploader } from "@/components/file-uploader";
import { uploadFile } from "@/lib/utils";

const protocolSchema = z.object({
  department: z.string({ required_error: "Kafedra seçilməlidir." }),
});

type FormValues = z.infer<typeof protocolSchema>;

interface DepartmentProtocolFormProps {
    documentType: 'protocol' | 'other';
}

export function DepartmentProtocolForm({ documentType }: DepartmentProtocolFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolFile, setProtocolFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(protocolSchema),
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    if (!protocolFile) {
        toast({ title: "Xəta!", description: "Sənəd faylını yükləməlisiniz.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
      const fileUrl = await uploadFile(protocolFile);
      await addDoc(collection(db, "departmentDocuments"), {
        documentType: documentType,
        department: values.department,
        fileUrl: fileUrl,
        submittedAt: serverTimestamp(),
      });

      toast({
        title: "Sənəd Göndərildi!",
        description: "Sənədiniz uğurla sistemə yükləndi.",
      });
      form.reset();
      setProtocolFile(null);
    } catch (error: any) {
      console.error("Error submitting protocol: ", error);
      toast({
        title: "Xəta!",
        description: error.message || "Sənəd göndərilərkən bir problem yarandı.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const title = documentType === 'protocol' ? 'Protokol Faylı' : 'Sənəd Faylı';
  const description = documentType === 'protocol' ? 'Protokoldan çıxarış faylını yükləyin.' : 'Müvafiq sənədi yükləyin.';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kafedra Seçin *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sənədi təqdim edən kafedra" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departmentList.map(dep => (
                    <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>{title} *</FormLabel>
          <FileUploader 
            id="department-protocol-file"
            onFileSelect={setProtocolFile}
          />
          <FormDescription>{description}</FormDescription>
        </FormItem>
        
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Göndərilir...' : 'Sənədi Göndər'}
        </Button>
      </form>
    </Form>
  );
}
