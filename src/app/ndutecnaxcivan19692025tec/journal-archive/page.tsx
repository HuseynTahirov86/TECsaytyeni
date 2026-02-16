
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, BookOpen } from "lucide-react";
import { ArchiveForm, JournalArchive } from "./archive-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { uploadFile } from "@/lib/utils";
import Image from "next/image";

export default function JournalArchiveAdminPage() {
  const [entries, setEntries] = useState<JournalArchive[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalArchive | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchArchives = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "journalArchives"), orderBy("title", "asc"));
      const querySnapshot = await getDocs(q);
      const entryList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as JournalArchive;
      });
      setEntries(entryList);
    } catch (error) {
      console.error("Error fetching journal archives: ", error);
      toast({ title: "Xəta", description: "Jurnal arxivini yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleFormSubmit = async (values: Omit<JournalArchive, "id">, imageFile: File | null, docFile: File | null) => {
    try {
      let imageUrl = values.imageUrl;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'sekiller');
      }

      let fileUrl = values.fileUrl;
      if (docFile) {
        fileUrl = await uploadFile(docFile, 'sekiller');
      }

      const dataToSave = { ...values, imageUrl, fileUrl };

      if (editingEntry && editingEntry !== 'new') {
        const entryRef = doc(db, "journalArchives", editingEntry.id);
        await updateDoc(entryRef, dataToSave);
        toast({ title: "Uğurlu", description: "Arxiv yeniləndi." });
      } else {
        await addDoc(collection(db, "journalArchives"), dataToSave);
        toast({ title: "Uğurlu", description: "Arxivə yeni jurnal əlavə edildi." });
      }
      
      await fetchArchives();
      setEditingEntry(null);
    } catch (error) {
      console.error("Error saving archive entry: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteDoc(doc(db, "journalArchives", entryId));
      toast({ title: "Uğurlu", description: "Jurnal silindi." });
      fetchArchives();
    } catch (error) {
      console.error("Error deleting entry: ", error);
      toast({ title: "Xəta", description: "Jurnalı silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Jurnal Arxivini İdarə Et</h1>
          <p className="text-muted-foreground">Yeni jurnal buraxılışı əlavə edin, redaktə edin və ya silin.</p>
        </div>
        <Button onClick={() => setEditingEntry(editingEntry === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
           {editingEntry === 'new' ? "Formu Bağla" : "Yeni Buraxılış Əlavə Et"}
        </Button>
      </div>

       {editingEntry && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingEntry === 'new' ? "Yeni Buraxılış Yarat" : "Buraxılışı Redaktə Et"}</CardTitle>
            <CardDescription>
                Jurnalın məlumatlarını daxil edin və ya yeniləyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArchiveForm 
              key={editingEntry === 'new' ? 'new-entry' : editingEntry.id}
              onSubmit={handleFormSubmit} 
              initialData={editingEntry === 'new' ? null : editingEntry} 
              onClose={() => setEditingEntry(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Arxivdəki Jurnallar</CardTitle>
          <CardDescription>Redaktə etmək üçün buraxılışın üzərinə klikləyin.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : entries.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {entries.map((entry) => (
                    <AccordionItem value={entry.id} key={entry.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                               <div className="flex items-center gap-4">
                                     <Image
                                        alt={entry.title}
                                        className="aspect-[3/4] rounded-md object-cover"
                                        height="48"
                                        src={entry.imageUrl || "https://placehold.co/48x64.png"}
                                        width="36"
                                      />
                                    <div className="text-left">
                                      <p className="font-medium">{entry.title}</p>
                                    </div>
                                </div>
                                <Badge variant={entry.journalType === 'science' ? 'default' : 'secondary'}>
                                  {entry.journalType === 'science' ? 'Elmi Jurnal' : 'Hüquq Jurnalı'}
                                </Badge>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingEntry(entry)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, jurnalı arxivdən həmişəlik siləcək.
                                        </AlertDialogDesc>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(entry.id)}>Davam et</AlertDialogAction>
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
                <BookOpen className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir jurnal tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
