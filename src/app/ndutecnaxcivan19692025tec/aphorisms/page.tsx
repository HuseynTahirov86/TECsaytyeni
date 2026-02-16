
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { AphorismForm, type Aphorism } from "./aphorism-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";
import Image from "next/image";

export default function AphorismsAdminPage() {
  const [aphorisms, setAphorisms] = useState<Aphorism[]>([]);
  const [editingAphorism, setEditingAphorism] = useState<Aphorism | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAphorisms = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "aphorisms"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const aphorismList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }) as Aphorism);
      setAphorisms(aphorismList);
    } catch (error) {
      console.error("Error fetching aphorisms: ", error);
      toast({ title: "Xəta", description: "Aforizmləri yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAphorisms();
  }, []);

  const handleFormSubmit = async (values: Omit<Aphorism, "id">, imageFile: File | null) => {
    try {
      let imageUrl = values.imageUrl;

      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'sekiller');
      }

      const dataToSave = { ...values, imageUrl };

      if (editingAphorism && editingAphorism !== 'new') {
        const aphorismRef = doc(db, "aphorisms", editingAphorism.id);
        await updateDoc(aphorismRef, dataToSave);
        toast({ title: "Uğurlu", description: "Aforizm yeniləndi." });
      } else {
        await addDoc(collection(db, "aphorisms"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni aforizm əlavə edildi." });
      }
      
      await fetchAphorisms();
      setEditingAphorism(null);
    } catch (error) {
      console.error("Error saving aphorism: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (aphorismId: string) => {
    try {
      await deleteDoc(doc(db, "aphorisms", aphorismId));
      toast({ title: "Uğurlu", description: "Aforizm silindi." });
      await fetchAphorisms();
    } catch (error) {
      console.error("Error deleting aphorism: ", error);
      toast({ title: "Xəta", description: "Aforizmi silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Aforizmləri İdarə Et</h1>
          <p className="text-muted-foreground">Ana səhifədəki karusel üçün şəkillər əlavə edin.</p>
        </div>
        <Button onClick={() => setEditingAphorism(editingAphorism === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingAphorism === 'new' ? "Formu Bağla" : "Yeni Aforizm Əlavə Et"}
        </Button>
      </div>

       {editingAphorism && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingAphorism === 'new' ? "Yeni Aforizm Yarat" : "Aforizmi Redaktə Et"}</CardTitle>
             <CardDescription>
                Şəkli yükləyin və sıralama nömrəsini təyin edin.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <AphorismForm 
              key={editingAphorism === 'new' ? 'new-aphorism' : editingAphorism.id}
              onSubmit={handleFormSubmit} 
              initialData={editingAphorism === 'new' ? null : editingAphorism} 
              onClose={() => setEditingAphorism(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Aforizmlər Siyahısı</CardTitle>
          <CardDescription>Redaktə etmək üçün aforizmin üzərinə klikləyin.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : aphorisms.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {aphorisms.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4">
                                     <Image
                                        alt={`Aphorism ${item.id}`}
                                        className="aspect-square rounded-md object-cover"
                                        height="40"
                                        src={item.imageUrl || "https://placehold.co/40x40.png"}
                                        width="40"
                                      />
                                    <span className="font-medium">Sıra: {item.order}</span>
                                </div>
                                <span className="text-sm text-muted-foreground truncate max-w-xs hidden md:inline-block">{item.imageUrl}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingAphorism(item)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, aforizmi sistemdən həmişəlik siləcək.
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
             <p className="text-center text-muted-foreground py-8">Heç bir aforizm tapılmadı.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
