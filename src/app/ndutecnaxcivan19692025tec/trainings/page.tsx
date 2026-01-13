
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, GraduationCap } from "lucide-react";
import { TrainingForm, type Training } from "./training-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile, generateSlug } from "@/lib/utils";

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    date.setUTCHours(0, 0, 0, 0);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('az-AZ', options).format(date);
};

type FileState = {
  mainImage: File | null;
  moduleImages: (File | null)[];
};

export default function TrainingsAdminPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [editingTraining, setEditingTraining] = useState<Training | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "trainings"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const trainingList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
        } as Training;
      });
      setTrainings(trainingList);
    } catch (error) {
      console.error("Error fetching trainings: ", error);
      toast({ title: "Xəta", description: "Təlimləri yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleFormSubmit = async (values: Omit<Training, "id">, files: FileState) => {
    try {
      let mainImageUrl = values.imageUrl;
      if (files.mainImage) {
        mainImageUrl = await uploadFile(files.mainImage, 'sekiller');
      }

      const uploadedModuleImageUrls = await Promise.all(
        values.modules.map(async (module, index) => {
            const moduleImageFile = files.moduleImages[index];
            if(moduleImageFile) {
                return await uploadFile(moduleImageFile, 'sekiller');
            }
            return module.imageUrl || ''; // Keep existing URL if no new file is provided
        })
      );
      
      const updatedModules = values.modules.map((module, index) => ({
        ...module,
        imageUrl: uploadedModuleImageUrls[index],
      }));

      const dataToSave = { ...values, imageUrl: mainImageUrl, modules: updatedModules, slug: generateSlug(values.title) };

      if (editingTraining && editingTraining !== 'new') {
        const trainingRef = doc(db, "trainings", editingTraining.id);
        await updateDoc(trainingRef, dataToSave);
        toast({ title: "Uğurlu", description: "Təlim yeniləndi." });
      } else {
        await addDoc(collection(db, "trainings"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni təlim əlavə edildi." });
      }
      
      await fetchTrainings();
      setEditingTraining(null);
    } catch (error) {
      console.error("Error saving training: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (trainingId: string) => {
    try {
      await deleteDoc(doc(db, "trainings", trainingId));
      toast({ title: "Uğurlu", description: "Təlim silindi." });
      fetchTrainings();
    } catch (error) {
      console.error("Error deleting training: ", error);
      toast({ title: "Xəta", description: "Təlimi silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Təlimləri İdarə Et</h1>
          <p className="text-muted-foreground">Yeni təlimlər yaradın və ya mövcud olanları redaktə edin.</p>
        </div>
        <Button onClick={() => setEditingTraining('new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Təlim Yarat
        </Button>
      </div>

      {editingTraining && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingTraining === 'new' ? 'Yeni Təlim Yarat' : 'Təlimi Redaktə Et'}</CardTitle>
            <CardDescription>
                Təlimin məlumatlarını daxil edin. AI köməkçilərindən istifadə edərək işinizi sürətləndirin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrainingForm
              key={editingTraining === 'new' ? 'new-training' : editingTraining.id}
              onSubmit={handleFormSubmit}
              initialData={editingTraining === 'new' ? null : editingTraining}
              onClose={() => setEditingTraining(null)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mövcud Təlimlər</CardTitle>
          <CardDescription>Redaktə etmək üçün təlimin üzərinə klikləyin.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : trainings.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {trainings.map((training) => (
                <AccordionItem value={training.id} key={training.id}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4 text-left">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            <div className="font-medium">{training.title}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{formatDate(training.date)}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                     <div className="p-4 bg-muted/50 rounded-b-md">
                        <p className="text-sm text-muted-foreground mb-4">{training.description}</p>
                         <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => setEditingTraining(training)}>
                                <Edit className="mr-2 h-4 w-4" /> Redaktə Et
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" /> Sil
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
                                    <AlertDialogDesc>
                                        Bu əməliyyat geri qaytarıla bilməz. Bu, təlimi həmişəlik siləcək.
                                    </AlertDialogDesc>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(training.id)}>Davam et</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                     </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-muted-foreground py-8">Heç bir təlim tapılmadı.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    