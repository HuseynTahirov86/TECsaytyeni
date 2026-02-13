
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FileUploader } from "@/components/file-uploader";

export interface OfficialDocuments {
  charterUrl: string;
  ethicsCodeUrl: string;
  researchRegulationUrl: string;
}

const formSchema = z.object({
  charterUrl: z.string().min(1, { message: "Əsasnamə faylı yüklənməlidir." }),
  ethicsCodeUrl: z.string().min(1, { message: "Etik kodeks faylı yüklənməlidir." }),
  researchRegulationUrl: z.string().min(1, { message: "Tədqiqat əsasnaməsi faylı yüklənməlidir." }),
});

type FormValues = z.infer<typeof formSchema>;

type FilesState = {
  charter: File | null;
  ethicsCode: File | null;
  researchRegulation: File | null;
}

interface DocumentsFormProps {
  onSubmit: (values: FormValues, files: FilesState) => Promise<void>;
  initialData: FormValues | null;
}

export function DocumentsForm({ onSubmit, initialData }: DocumentsFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FilesState>({ charter: null, ethicsCode: null, researchRegulation: null });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      charterUrl: "",
      ethicsCodeUrl: "",
      researchRegulationUrl: "",
    },
  });

  const handleFileSelect = (file: File | null, fieldName: keyof FilesState) => {
    setFiles(prev => ({ ...prev, [fieldName]: file }));
    if (file) {
      form.setValue(fieldName === 'charter' ? 'charterUrl' : fieldName === 'ethicsCode' ? 'ethicsCodeUrl' : 'researchRegulationUrl', file.name, { shouldValidate: true });
    } else {
      form.setValue(fieldName === 'charter' ? 'charterUrl' : fieldName === 'ethicsCode' ? 'ethicsCodeUrl' : 'researchRegulationUrl', '', { shouldValidate: true });
    }
  };

  const handleSubmit = async (values: FormValues) => {
     if ((!files.charter && !initialData?.charterUrl) || (!files.ethicsCode && !initialData?.ethicsCodeUrl) || (!files.researchRegulation && !initialData?.researchRegulationUrl)) {
        toast({ title: "Xəta!", description: "Zəhmət olmasa, bütün sənəd fayllarını yükləyin.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values, files);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="charterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TEC Əsasnaməsi</FormLabel>
              <FormControl>
                <FileUploader 
                  id="charter-file" 
                  onFileSelect={(file) => handleFileSelect(file, 'charter')} 
                  initialUrl={initialData?.charterUrl} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ethicsCodeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etik Davranış Kodeksi</FormLabel>
              <FormControl>
                <FileUploader 
                  id="ethics-code-file" 
                  onFileSelect={(file) => handleFileSelect(file, 'ethicsCode')} 
                  initialUrl={initialData?.ethicsCodeUrl} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="researchRegulationUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Təhsilalanların Elmi Tədqiqat İşi Haqqında Əsasnamə</FormLabel>
              <FormControl>
                <FileUploader 
                  id="research-regulation-file" 
                  onFileSelect={(file) => handleFileSelect(file, 'researchRegulation')} 
                  initialUrl={initialData?.researchRegulationUrl} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
