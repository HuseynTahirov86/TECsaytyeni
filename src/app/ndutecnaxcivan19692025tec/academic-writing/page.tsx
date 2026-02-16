
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, BookText } from "lucide-react";
import { AcademicWritingRuleForm, type AcademicWritingRule } from "./form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";
import Image from "next/image";

export default function AcademicWritingRulesAdminPage() {
  const [rules, setRules] = useState<AcademicWritingRule[]>([]);
  const [editingRule, setEditingRule] = useState<AcademicWritingRule | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "academicWritingRules"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const ruleList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }) as AcademicWritingRule);
      setRules(ruleList);
    } catch (error) {
      console.error("Error fetching rules: ", error);
      toast({ title: "Xəta", description: "Qaydaları yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleFormSubmit = async (values: Omit<AcademicWritingRule, "id">, imageFile: File | null) => {
    try {
      let imageUrl = values.imageUrl;

      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'sekiller');
      }

      const dataToSave = { ...values, imageUrl };

      if (editingRule && editingRule !== 'new') {
        const ruleRef = doc(db, "academicWritingRules", editingRule.id);
        await updateDoc(ruleRef, dataToSave);
        toast({ title: "Uğurlu", description: "Qayda yeniləndi." });
      } else {
        await addDoc(collection(db, "academicWritingRules"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni qayda əlavə edildi." });
      }
      
      await fetchRules();
      setEditingRule(null);
    } catch (error) {
      console.error("Error saving rule: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      await deleteDoc(doc(db, "academicWritingRules", ruleId));
      toast({ title: "Uğurlu", description: "Qayda silindi." });
      await fetchRules();
    } catch (error) {
      console.error("Error deleting rule: ", error);
      toast({ title: "Xəta", description: "Qaydanı silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Akademik Yazı Qaydalarını İdarə Et</h1>
          <p className="text-muted-foreground">Ana səhifədəki karusel üçün şəkillər əlavə edin.</p>
        </div>
        <Button onClick={() => setEditingRule(editingRule === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingRule === 'new' ? "Formu Bağla" : "Yeni Qayda Əlavə Et"}
        </Button>
      </div>

       {editingRule && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingRule === 'new' ? "Yeni Qayda Yarat" : "Qaydanı Redaktə Et"}</CardTitle>
             <CardDescription>
                Şəkli yükləyin və sıralama nömrəsini təyin edin.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <AcademicWritingRuleForm 
              key={editingRule === 'new' ? 'new-rule' : editingRule.id}
              onSubmit={handleFormSubmit} 
              initialData={editingRule === 'new' ? null : editingRule} 
              onClose={() => setEditingRule(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Qaydalar Siyahısı</CardTitle>
          <CardDescription>Redaktə etmək üçün qaydanın üzərinə klikləyin.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : rules.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {rules.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4">
                                     <Image
                                        alt={`Rule ${item.id}`}
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
                                <Button size="sm" onClick={() => setEditingRule(item)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, qaydanı sistemdən həmişəlik siləcək.
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
                <BookText className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir qayda tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
