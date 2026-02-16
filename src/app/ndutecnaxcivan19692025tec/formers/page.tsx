
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, User } from "lucide-react";
import { FormerChairmanForm, FormerChairman } from "./former-chairman-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";
import Image from "next/image";

export default function FormerChairmenAdminPage() {
  const [chairmen, setChairmen] = useState<FormerChairman[]>([]);
  const [editingChairman, setEditingChairman] = useState<FormerChairman | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchChairmen = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "formerChairmen"), orderBy("period", "desc"));
      const querySnapshot = await getDocs(q);
      const chairmanList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }) as FormerChairman);
      setChairmen(chairmanList);
    } catch (error) {
      console.error("Error fetching former chairmen: ", error);
      toast({ title: "Xəta", description: "Sabiq sədrləri yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChairmen();
  }, []);

  const handleFormSubmit = async (values: Omit<FormerChairman, "id">, imageFile: File | null) => {
    try {
      let avatarUrl = values.avatarUrl;
      if (imageFile) {
        avatarUrl = await uploadFile(imageFile, 'sekiller');
      }
      
      const dataToSave = { ...values, avatarUrl };

      if (editingChairman && editingChairman !== 'new') {
        const chairmanRef = doc(db, "formerChairmen", editingChairman.id);
        await updateDoc(chairmanRef, dataToSave);
        toast({ title: "Uğurlu", description: "Sabiq sədr məlumatları yeniləndi." });
      } else {
        await addDoc(collection(db, "formerChairmen"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni sabiq sədr əlavə edildi." });
      }
      
      fetchChairmen();
      setEditingChairman(null);
    } catch (error) {
      console.error("Error saving chairman: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (chairmanId: string) => {
    try {
      await deleteDoc(doc(db, "formerChairmen", chairmanId));
      toast({ title: "Uğurlu", description: "Sabiq sədr silindi." });
      fetchChairmen();
    } catch (error) {
      console.error("Error deleting chairman: ", error);
      toast({ title: "Xəta", description: "Sədr məlumatını silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sabiq Sədrləri İdarə Et</h1>
          <p className="text-muted-foreground">Yeni sabiq sədr əlavə edin, redaktə edin və ya silin.</p>
        </div>
        <Button onClick={() => setEditingChairman(editingChairman === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingChairman === 'new' ? "Formu Bağla" : "Yeni Sədr Əlavə Et"}
        </Button>
      </div>

       {editingChairman && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingChairman === 'new' ? "Yeni Sədr Əlavə Et" : "Sədr Məlumatını Redaktə Et"}</CardTitle>
            <CardDescription>
                Sabiq sədrin məlumatlarını daxil edin və ya yeniləyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <FormerChairmanForm 
              key={editingChairman === 'new' ? 'new-chairman' : editingChairman.id}
              onSubmit={handleFormSubmit} 
              initialData={editingChairman === 'new' ? null : editingChairman} 
              onClose={() => setEditingChairman(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sabiq TEC Sədrləri</CardTitle>
          <CardDescription>"Haqqımızda" səhifəsində görünən sədrlər.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : chairmen.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {chairmen.map((chairman) => (
                    <AccordionItem value={chairman.id} key={chairman.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                               <div className="flex items-center gap-4">
                                     <Image
                                        alt={chairman.name}
                                        className="aspect-square rounded-full object-cover"
                                        height="40"
                                        src={chairman.avatarUrl || "https://placehold.co/40x40.png"}
                                        width="40"
                                      />
                                    <span className="font-medium">{chairman.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{chairman.period}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingChairman(chairman)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, sədr məlumatını sistemdən həmişəlik siləcək.
                                        </AlertDialogDesc>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(chairman.id)}>Davam et</AlertDialogAction>
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
                <User className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir sabiq sədr tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
