
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Save, X, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUploader } from "@/components/image-uploader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/rich-text-editor";

const questionSchema = z.object({
  question: z.string().min(5, "Sual ən azı 5 simvoldan ibarət olmalıdır."),
  options: z.array(z.string().min(1, "Variant boş ola bilməz.")).min(2, "Ən azı 2 variant olmalıdır."),
  correctAnswer: z.coerce.number().min(0, "Düzgün cavab seçilməlidir."),
});

const moduleSchema = z.object({
    title: z.string().min(5, "Modul başlığı ən azı 5 simvoldan ibarət olmalıdır."),
    content: z.string().min(20, "Modul məzmunu ən azı 20 simvoldan ibarət olmalıdır."),
    imageUrl: z.string().optional().nullable(),
    imageHint: z.string().min(2, { message: "Şəkil üçün açar söz daxil edin." }),
});

export interface Training {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  imageUrl: string;
  imageHint: string;
  hasCertificate: boolean;
  modules: (Omit<z.infer<typeof moduleSchema>, 'previewUrl' | 'imageFile'> & { imageUrl: string, imageHint: string })[];
  quiz: z.infer<typeof questionSchema>[];
}

const formSchema = z.object({
  title: z.string().min(10, { message: "Başlıq ən azı 10 simvoldan ibarət olmalıdır." }),
  description: z.string().min(20, { message: "Qısa təsvir ən azı 20 simvoldan ibarət olmalıdır." }),
  content: z.string().min(50, { message: "Giriş məzmunu ən azı 50 simvoldan ibarət olmalıdır." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Düzgün tarix daxil edin." }),
  imageUrl: z.string().min(1, { message: "Əsas şəkil yüklənməlidir." }),
  imageHint: z.string().min(2, {message: "Şəkil üçün açar söz daxil edin."}),
  hasCertificate: z.boolean().default(false),
  modules: z.array(moduleSchema).min(1, "Ən azı 1 modul olmalıdır."),
  quiz: z.array(questionSchema).optional(),
}).refine((data) => {
  if (data.hasCertificate && (!data.quiz || data.quiz.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Sertifikat aktivdirsə, ən azı 1 test sualı olmalıdır.",
  path: ["quiz"]
});

type FormValues = z.infer<typeof formSchema>;

type FileState = {
  mainImage: File | null;
  moduleImages: (File | null)[];
};

interface TrainingFormProps {
  onSubmit: (values: Omit<Training, 'id'>, files: FileState) => Promise<void>;
  initialData?: Training | null;
  onClose: () => void;
}

export function TrainingForm({ onSubmit, initialData, onClose }: TrainingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [moduleImagePreviews, setModuleImagePreviews] = useState<(string | null)[]>(initialData?.modules.map(m => m.imageUrl) || []);
  const [files, setFiles] = useState<FileState>({ mainImage: null, moduleImages: [] });


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      date: initialData?.date || new Date().toISOString().split('T')[0],
      imageUrl: initialData?.imageUrl || "",
      imageHint: initialData?.imageHint || "",
      hasCertificate: initialData?.hasCertificate || false,
      modules: initialData?.modules || [{ title: '', content: '', imageUrl: '', imageHint: '' }],
      quiz: initialData?.quiz || [],
    },
  });

  const { control, getValues, setValue, watch, trigger } = form;
  const hasCertificate = watch("hasCertificate");

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control,
    name: "modules",
  });
  
  const { fields: quizFields, append: appendQuiz, remove: removeQuiz, update: updateQuiz } = useFieldArray({
    control,
    name: "quiz",
  });

  const handleMainImageSelect = (file: File | null) => {
    setFiles(prev => ({ ...prev, mainImage: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setMainImagePreview(url);
      setValue('imageUrl', url, { shouldValidate: true });
    } else {
      setMainImagePreview(null);
      setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const handleModuleImageSelect = (file: File | null, index: number) => {
    setFiles(prev => {
        const newModuleImages = [...prev.moduleImages];
        newModuleImages[index] = file;
        return { ...prev, moduleImages: newModuleImages };
    });

    setModuleImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[index] = file ? URL.createObjectURL(file) : null;
        return newPreviews;
    });

    setValue(`modules.${index}.imageUrl`, file ? 'file-selected' : '', { shouldValidate: true });
  };

  const handleSubmit = async (values: FormValues) => {
    if (!files.mainImage && !initialData) {
        toast({ title: "Xəta!", description: "Təlim üçün əsas şəkil yüklənməlidir.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
        const dataToSubmit: Omit<Training, 'id'> = {
            ...values,
            slug: generateSlug(values.title),
            modules: values.modules.map(m => ({
              title: m.title,
              content: m.content,
              imageUrl: m.imageUrl || '',
              imageHint: m.imageHint,
            })),
            quiz: values.quiz || [],
        };
        
        await onSubmit(dataToSubmit, files);
        onClose();

    } catch (error: any) {
        toast({ title: "Xəta!", description: error.message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            <Card>
                <CardHeader><CardTitle>Əsas Məlumatlar</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <FormField name="title" control={control} render={({ field }) => (
                        <FormItem><FormLabel>Başlıq</FormLabel><FormControl><Input placeholder="Təlimin başlığı" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="description" control={control} render={({ field }) => (
                        <FormItem><FormLabel>Qısa Təsvir</FormLabel><FormControl><Textarea placeholder="Təlimlər səhifəsində görünəcək anons" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="content" control={control} render={({ field }) => (
                        <FormItem><FormLabel>Giriş Məzmunu</FormLabel><FormControl><RichTextEditor placeholder="Təlimin əsas səhifəsində modullardan əvvəl görünəcək mətn" {...field} rows={8} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField name="date" control={control} render={({ field }) => (
                        <FormItem><FormLabel>Tarix</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <div className="grid grid-cols-1 gap-4">
                        <FormField name="imageUrl" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Təlimin Əsas Şəkli</FormLabel>
                                <FormControl>
                                    <ImageUploader id="main-training-image" onFileSelect={handleMainImageSelect} previewUrl={mainImagePreview} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="imageHint" control={control} render={({ field }) => (
                            <FormItem><FormLabel>Şəkil Açar Sözü</FormLabel><FormControl><Input placeholder="AI üçün şəkil təsviri" {...field} /></FormControl><FormDescription>AI ilə şəkil generasiya edərkən istifadə olunur.</FormDescription><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField name="hasCertificate" control={control} render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5"><FormLabel>Sertifikat</FormLabel><FormDescription>Bu təlimi bitirənlərə sertifikat təqdim edilsin?</FormDescription></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                </CardContent>
            </Card>

            <div>
                <h3 className="text-lg font-medium my-4">Modullar</h3>
                <div className="space-y-4">
                    {moduleFields.map((field, index) => (
                        <Card key={field.id} className="bg-muted/30">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">Modul {index + 1}</CardTitle>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeModule(index)} disabled={moduleFields.length <= 1}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField name={`modules.${index}.title`} control={control} render={({ field }) => (
                                    <FormItem><FormLabel>Başlıq</FormLabel><FormControl><Input placeholder="Modul başlığı" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormItem>
                                    <FormLabel>Məzmun</FormLabel>
                                     <FormField name={`modules.${index}.content`} control={control} render={({ field }) => (
                                         <RichTextEditor placeholder="Modulun məzmununu daxil edin..." {...field} rows={6} className="flex-grow"/>
                                     )} />
                                     <FormMessage>{form.formState.errors.modules?.[index]?.content?.message}</FormMessage>
                                </FormItem>
                                 <div className="grid grid-cols-1 gap-4">
                                     <FormField name={`modules.${index}.imageUrl`} control={control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Modul Şəkli</FormLabel>
                                            <FormControl>
                                               <ImageUploader id={`module-image-${index}`} onFileSelect={(file) => handleModuleImageSelect(file, index)} previewUrl={moduleImagePreviews[index]} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField name={`modules.${index}.imageHint`} control={control} render={({ field }) => (
                                        <FormItem><FormLabel>Şəkil Açar Sözü</FormLabel><FormControl><Input placeholder="AI üçün şəkil təsviri" {...field} /></FormControl><FormDescription>AI ilə şəkil generasiya edərkən istifadə olunur.</FormDescription><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendModule({ title: '', content: '', imageUrl: '', imageHint: '' })} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Modul Əlavə Et
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Test Sualları</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     {hasCertificate && (!watch('quiz') || watch('quiz')?.length === 0) && (
                        <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>Sertifikat aktivdirsə, ən azı 1 test sualı olmalıdır.</AlertDescription></Alert>
                    )}

                    <div className="space-y-4">
                         {quizFields.map((field, questionIndex) => (
                            <Card key={field.id} className="p-4 border-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold">Sual {questionIndex + 1}</h4>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeQuiz(questionIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                                <div className="space-y-4">
                                    <FormField name={`quiz.${questionIndex}.question`} control={control} render={({ field }) => (
                                        <FormItem><FormLabel>Sualın Mətni</FormLabel><FormControl><Input placeholder="Sualı daxil edin" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    
                                    <FormItem>
                                        <FormLabel>Cavab Variantları</FormLabel>
                                        <RadioGroup 
                                            value={watch(`quiz.${questionIndex}.correctAnswer`)?.toString()} 
                                            onValueChange={(value) => setValue(`quiz.${questionIndex}.correctAnswer`, parseInt(value))}
                                        >
                                            {watch(`quiz.${questionIndex}.options`)?.map((_, optionIndex) => (
                                                <FormField key={optionIndex} name={`quiz.${questionIndex}.options.${optionIndex}`} control={control} render={({ field }) => (
                                                    <FormItem className="flex items-center gap-2">
                                                        <FormControl>
                                                            <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-o${optionIndex}`} />
                                                        </FormControl>
                                                        <Input placeholder={`Variant ${optionIndex + 1}`} {...field} />
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                                                            const options = getValues(`quiz.${questionIndex}.options`);
                                                            options.splice(optionIndex, 1);
                                                            setValue(`quiz.${questionIndex}.options`, options);
                                                        }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                    </FormItem>
                                                )} />
                                            ))}
                                        </RadioGroup>
                                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => {
                                            const options = getValues(`quiz.${questionIndex}.options`) || [];
                                            setValue(`quiz.${questionIndex}.options`, [...options, ""]);
                                        }}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Variant Əlavə Et
                                        </Button>
                                    </FormItem>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={() => appendQuiz({ question: '', options: ['', ''], correctAnswer: 0 })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Yeni Sual Əlavə Et
                        </Button>
                    </div>

                     {watch('quiz') && watch('quiz')!.length > 0 && (
                        <Alert variant="default" className="bg-green-50"><CheckCircle className="h-4 w-4" /><AlertDescription>{watch('quiz')?.length} sual tərtib edildi.</AlertDescription></Alert>
                    )}
                </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}><X className="mr-2 h-4 w-4" /> Ləğv Et</Button>
              <Button type="submit" disabled={isSubmitting}><Save className="mr-2 h-4 w-4" /> {isSubmitting ? 'Saxlanılır...' : (initialData ? 'Yenilə' : 'Təlimi Yarat')}</Button>
            </div>
       </form>
    </Form>
  );
}
