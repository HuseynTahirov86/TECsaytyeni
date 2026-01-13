
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { HeroSlideForm, type HeroSlide } from "./slide-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function HeroSlidesAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSlides = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "heroSlides"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const slideList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }) as HeroSlide);
      setSlides(slideList);
    } catch (error) {
      console.error("Error fetching slides: ", error);
      toast({ title: "Xəta", description: "Slaydları yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFormSubmit = async (values: Omit<HeroSlide, "id">, imageFile: File | null) => {
    try {
      let imageUrl = values.imageUrl;

      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'sekiller');
      }

      const dataToSave = { ...values, imageUrl };

      if (editingSlide && editingSlide !== 'new') {
        const slideRef = doc(db, "heroSlides", editingSlide.id);
        await updateDoc(slideRef, dataToSave);
        toast({ title: "Uğurlu", description: "Slayd yeniləndi." });
      } else {
        await addDoc(collection(db, "heroSlides"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni slayd əlavə edildi." });
      }
      
      await fetchSlides();
      setEditingSlide(null);
    } catch (error) {
      console.error("Error saving slide: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (slideId: string) => {
    try {
      await deleteDoc(doc(db, "heroSlides", slideId));
      toast({ title: "Uğurlu", description: "Slayd silindi." });
      await fetchSlides();
    } catch (error) {
      console.error("Error deleting slide: ", error);
      toast({ title: "Xəta", description: "Slaydı silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hero Karuselini İdarə Et</h1>
          <p className="text-muted-foreground">Ana səhifədəki karusel üçün slaydları idarə edin.</p>
        </div>
        <Button onClick={() => setEditingSlide(editingSlide === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingSlide === 'new' ? "Formu Bağla" : "Yeni Slayd Əlavə Et"}
        </Button>
      </div>

       {editingSlide && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingSlide === 'new' ? "Yeni Slayd Yarat" : "Slaydı Redaktə Et"}</CardTitle>
             <CardDescription>
                Şəkli yükləyin, növünü və sıralama nömrəsini təyin edin.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <HeroSlideForm 
              key={editingSlide === 'new' ? 'new-slide' : editingSlide.id}
              onSubmit={handleFormSubmit} 
              initialData={editingSlide === 'new' ? null : editingSlide} 
              onClose={() => setEditingSlide(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Slaydlar Siyahısı</CardTitle>
          <CardDescription>Redaktə etmək üçün slaydın üzərinə klikləyin.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : slides.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {slides.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4">
                                     <img
                                        alt={item.title || `Slide ${item.id}`}
                                        className="aspect-video rounded-md object-cover"
                                        height="40"
                                        src={item.imageUrl || "https://placehold.co/70x40.png"}
                                        width="70"
                                      />
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{item.title || `Slayd ${item.order}`}</span>
                                        <Badge variant={item.type === 'main' ? 'default' : 'secondary'} className="mt-1">{item.type === 'main' ? 'Əsas Slayd' : 'Şəkil Slaydı'}</Badge>
                                    </div>
                                </div>
                                <span className="text-sm text-muted-foreground hidden md:inline-block">Sıra: {item.order}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingSlide(item)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, slaydı sistemdən həmişəlik siləcək.
                                        </AlertDialogDesc>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(item.id)}>Davam et</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
             </Accordion>
           ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <ImageIcon className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir slayd tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
