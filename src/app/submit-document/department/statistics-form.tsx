
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { departmentList } from "@/lib/placeholder-data";
import { FileUploader } from "@/components/file-uploader";
import { uploadFile } from "@/lib/utils";

const statisticsSchema = z.object({
  department: z.string({ required_error: "Kafedra seçilməlidir." }),
  azCitizenTotal: z.coerce.number().min(0, "Mənfi dəyər ola bilməz."),
  azCitizenMale: z.coerce.number().min(0, "Mənfi dəyər ola bilməz."),
  azCitizenFemale: z.coerce.number().min(0, "Mənfi dəyər ola bilməz."),
  foreignCitizenTotal: z.coerce.number().min(0, "Mənfi dəyər ola bilməz."),
  foreignCitizenMale: z.coerce.number().min(0, "Mənfi dəyər ola bilməz."),
  foreignCitizenFemale: z.coerce.number().min(0, "Mənfi dəyər ola bilməz."),
});

type FormValues = z.infer<typeof statisticsSchema>;

export function DepartmentStatisticsForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(statisticsSchema),
    defaultValues: {
      azCitizenTotal: 0,
      azCitizenMale: 0,
      azCitizenFemale: 0,
      foreignCitizenTotal: 0,
      foreignCitizenMale: 0,
      foreignCitizenFemale: 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    if (!reportFile) {
        toast({ title: "Xəta!", description: "Siyahı faylını yükləməlisiniz.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const { azCitizenTotal, azCitizenMale, azCitizenFemale, foreignCitizenTotal, foreignCitizenMale, foreignCitizenFemale } = values;
    
    if (azCitizenMale + azCitizenFemale !== azCitizenTotal) {
        toast({
            title: "Məntiqi Xəta (Azərbaycan Vətəndaşları)",
            description: "Oğlan və qızların sayının cəmi ümumi saya bərabər olmalıdır.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }
    
    if (foreignCitizenMale + foreignCitizenFemale !== foreignCitizenTotal) {
        toast({
            title: "Məntiqi Xəta (Əcnəbi Vətəndaşlar)",
            description: "Oğlan və qızların sayının cəmi ümumi saya bərabər olmalıdır.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    try {
      const fileUrl = await uploadFile(reportFile);
      await addDoc(collection(db, "departmentDocuments"), {
        documentType: 'statistics',
        department: values.department,
        statistics: {
          az: {
            total: azCitizenTotal,
            male: azCitizenMale,
            female: azCitizenFemale,
          },
          foreign: {
            total: foreignCitizenTotal,
            male: foreignCitizenMale,
            female: foreignCitizenFemale,
          }
        },
        fileUrl: fileUrl,
        submittedAt: serverTimestamp(),
      });

      toast({
        title: "Siyahı Göndərildi!",
        description: "Siyahınız uğurla sistemə yükləndi.",
      });
      form.reset();
      setReportFile(null);
    } catch (error: any) {
      console.error("Error submitting report: ", error);
      toast({
        title: "Xəta!",
        description: error.message || "Siyahı göndərilərkən bir problem yarandı.",
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kafedra Seçin *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Siyahını təqdim edən kafedra" />
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

        <div className="space-y-4">
            <h3 className="font-medium">Azərbaycan Vətəndaşları</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="azCitizenTotal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tələbələrin ümumi sayı *</FormLabel>
                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="azCitizenMale"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Onlardan oğlanların sayı *</FormLabel>
                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="azCitizenFemale"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Onlardan qızların sayı *</FormLabel>
                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-medium">Əcnəbi Vətəndaşlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="foreignCitizenTotal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tələbələrin ümumi sayı *</FormLabel>
                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="foreignCitizenMale"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Onlardan oğlanların sayı *</FormLabel>
                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="foreignCitizenFemale"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Onlardan qızların sayı *</FormLabel>
                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
            </div>
        </div>
        
        <FormItem>
            <FormLabel>Siyahı Faylı *</FormLabel>
            <div className="flex items-start gap-4">
                <div className="flex-grow">
                    <FileUploader 
                        id="statistics-report-file"
                        onFileSelect={setReportFile}
                    />
                    <FormDescription className="mt-2">Yekun siyahı sənədini yükləyin.</FormDescription>
                </div>
                 <a href="/TECsiyahinumunesi.docx" download="TECsiyahinumunesi.docx">
                    <Button type="button" variant="outline">
                        <Download className="mr-2 h-4 w-4"/>
                        Siyahı Nümunəsi
                    </Button>
                 </a>
            </div>
        </FormItem>
        
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Göndərilir...' : 'Məlumatı Göndər'}
        </Button>
      </form>
    </Form>
  );
}
