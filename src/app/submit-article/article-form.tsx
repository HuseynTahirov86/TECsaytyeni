
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadFile } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/file-uploader";
import { PlusCircle, Trash2 } from "lucide-react";

const submissionSchema = z.object({
    firstName: z.string().min(2, "Ad ən azı 2 simvoldan ibarət olmalıdır."),
    lastName: z.string().min(2, "Soyad ən azı 2 simvoldan ibarət olmalıdır."),
    otherAuthors: z.string().optional(),
    articleTitle: z.string().min(10, "Məqalənin adı ən azı 10 simvoldan ibarət olmalıdır."),
    fieldOfStudy: z.string().min(3, "Elm/hüquq sahəsi daxil edilməlidir."),
    pageCount: z.coerce.number().min(1, "Səhifə sayı ən azı 1 olmalıdır."),
    academicInfo: z.string().min(10, "Bu sahə doldurulmalıdır."),
    email: z.string().email("Düzgün e-poçt ünvanı daxil edin."),
    phone: z.string().min(10, "Düzgün əlaqə nömrəsi daxil edin."),
    copyrightPermission: z.boolean().refine(val => val === true, { message: "Müəlliflik hüququ icazəsini qəbul etməlisiniz." }),
    notes: z.string().optional(),
    // File fields are handled separately, not part of Zod schema for validation
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface ArticleFormProps {
    journalType: 'science' | 'law';
}

export function ArticleForm({ journalType }: ArticleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [reviewFiles, setReviewFiles] = useState<(File | null)[]>([null, null]);

  const isLawJournal = journalType === 'law';

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
        firstName: "",
        lastName: "",
        otherAuthors: "",
        articleTitle: "",
        fieldOfStudy: "",
        pageCount: 7,
        academicInfo: "",
        email: "",
        phone: "",
        copyrightPermission: false,
        notes: "",
    },
  });

  const handleReviewFileSelect = (file: File | null, index: number) => {
    const newFiles = [...reviewFiles];
    newFiles[index] = file;
    setReviewFiles(newFiles);
  };
  
  const addReviewFileInput = () => {
    setReviewFiles([...reviewFiles, null]);
  };

  const removeReviewFileInput = (index: number) => {
    if (reviewFiles.length > 2) {
      const newFiles = [...reviewFiles];
      newFiles.splice(index, 1);
      setReviewFiles(newFiles);
    }
  };


  async function onSubmit(values: SubmissionFormValues) {
    setIsSubmitting(true);
    
    if (!articleFile) {
        toast({ title: "Xəta!", description: "Məqalə faylını yükləməlisiniz.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }
    
    const validReviewFiles = reviewFiles.filter(file => file !== null) as File[];
    if (validReviewFiles.length < 2) {
        toast({ title: "Xəta!", description: "Ən azı 2 rəy faylı yükləməlisiniz.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
        const collectionName = isLawJournal ? 'lawSubmissions' : 'scienceSubmissions';
        
        // Upload files and get URLs
        const articleFileUrl = await uploadFile(articleFile);
        const reviewFileUrls = await Promise.all(validReviewFiles.map(file => uploadFile(file)));

        const dbData: any = {
            ...values,
            articleFileUrl,
            reviewFileUrls,
            submittedAt: serverTimestamp(),
            status: 'gözləmədə',
        };
        
        if (isLawJournal) {
            dbData.fieldOfLaw = dbData.fieldOfStudy;
        } else {
            dbData.fieldOfScience = dbData.fieldOfStudy;
        }
        delete dbData.fieldOfStudy;
    
        await addDoc(collection(db, collectionName), dbData);

        toast({
            title: "Məqalə Göndərildi!",
            description: "Təqdimatınız üçün təşəkkür edirik. Məqaləniz nəzərdən keçirilməsi üçün qəbul edildi.",
        });
        form.reset();
        setArticleFile(null);
        setReviewFiles([null, null]);

    } catch (error: any) {
        console.error("Error submitting article: ", error);
        toast({
            title: "Xəta!",
            description: error.message || "Məqalə göndərilərkən bir problem yarandı.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <p className="text-sm text-destructive">* işarəsi olan sahələrin doldurulması məcburidir.</p>
            
            <div>
                 <h3 className="text-lg font-medium mb-4">Müəllif Məlumatları</h3>
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem><FormLabel>Adınız *</FormLabel><FormControl><Input placeholder="Adınız" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem><FormLabel>Soyadınız *</FormLabel><FormControl><Input placeholder="Soyadınız" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="otherAuthors" render={({ field }) => (
                        <FormItem><FormLabel>Digər müəllif(lər)</FormLabel><FormControl><Input placeholder="Varsa, digər müəlliflərin adları (vergüllə ayırın)" {...field} /></FormControl><FormMessage /></FormItem>
                     )} />
                    <FormField control={form.control} name="academicInfo" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Təhsil, akademik titullar, praktika və s. *</FormLabel>
                            <FormControl><Textarea rows={4} placeholder="Akademik və peşəkar məlumatlarınızı daxil edin" {...field} /></FormControl>
                            <FormDescription>Məsələn: NDU, Hüquqşünaslıq, 3-cü kurs.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                 </div>
            </div>

            <Separator />
            
             <div>
                 <h3 className="text-lg font-medium mb-4">Məqalə Məlumatları</h3>
                 <div className="space-y-4">
                    <FormField control={form.control} name="articleTitle" render={({ field }) => (
                        <FormItem><FormLabel>Məqalənin adı *</FormLabel><FormControl><Input placeholder="Məqalənizin tam başlığı" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="fieldOfStudy" render={({ field }) => (
                            <FormItem><FormLabel>{isLawJournal ? 'Hüquq sahəsi' : 'Elm sahəsi'} *</FormLabel><FormControl><Input placeholder={isLawJournal ? 'Məs., Mülki Hüquq' : 'Məs., Fizika, Biologiya'} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="pageCount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Səhifə sayı *</FormLabel>
                                <FormControl><Input type="number" min="1" placeholder="Minimum 7 səhifə" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     {isLawJournal && <p className="text-sm text-muted-foreground">(Minimum: 7, Maksimum: 30 səhifə)</p>}
                 </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Fayllar</h3>
                <div className="space-y-6">
                   <FormItem>
                      <FormLabel>Məqalə Faylı *</FormLabel>
                      <FileUploader 
                        id="article-file"
                        onFileSelect={setArticleFile}
                      />
                   </FormItem>
                    
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium">Rəylər *</h4>
                        <p className="text-sm text-muted-foreground">Zəhmət olmasa, məqalənizə aid ən azı iki rəy faylı yükləyin.</p>
                        {reviewFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="flex-grow">
                                  <FileUploader 
                                    id={`review-file-${index}`}
                                    onFileSelect={(selectedFile) => handleReviewFileSelect(selectedFile, index)}
                                  />
                                </div>
                                {reviewFiles.length > 2 && (
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeReviewFileInput(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addReviewFileInput}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Daha bir rəy əlavə et
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />
            
             <div>
                <h3 className="text-lg font-medium mb-4">Əlaqə və Təsdiq</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Elektron ünvan *</FormLabel><FormControl><Input type="email" placeholder="nümunə@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Əlaqə nömrəsi *</FormLabel><FormControl><Input type="tel" placeholder="+994 xx xxx xx xx" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Qeyd</FormLabel>
                            <FormControl><Textarea placeholder="Redaksiyaya hər hansı bir sualınız və ya qeydiniz varsa, burada bildirin." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="copyrightPermission" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>Müəlliflik hüququ icazəsi *</FormLabel>
                            <FormDescription>
                                Məqalənizi, əsərinizi və ya işinizi göndərməklə siz Naxçıvan Dövlət Universiteti {isLawJournal ? "Tələbə Hüquq Jurnalını" : "Tələbə Elmi Jurnalını"} məqalənizin yayımı ilə bağlı qeyri-müstəsna müəlliflik hüquqları, o cümlədən məqalənizin işlənməsi, surətinin çıxarılması, qəbul edildikdə yayımı hüquqları ilə təmin etməyə razı olursunuz.
                            </FormDescription>
                            <FormMessage />
                            </div>
                        </FormItem>
                    )} />
                </div>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Göndərilir...' : 'Məqaləni Göndər'}
            </Button>
        </form>
      </Form>
  );
}
