
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, Library, Search } from "lucide-react";
import { LibraryForm, LibraryEntry } from "./library-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile, generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function LibraryAdminPage() {
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<LibraryEntry | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchLibraryEntries = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "library"), orderBy("title", "asc"));
      const querySnapshot = await getDocs(q);
      const entryList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as LibraryEntry;
      });
      setEntries(entryList);
    } catch (error) {
      console.error("Error fetching library entries: ", error);
      toast({ title: "Xəta", description: "Kitabxana materiallarını yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryEntries();
  }, []);

  const handleFormSubmit = async (values: Omit<LibraryEntry, "id">, imageFile: File | null, docFile: File | null) => {
    try {
        let imageUrl = values.imageUrl;
        if (imageFile) {
            imageUrl = await uploadFile(imageFile);
        }

        let fileUrl = values.fileUrl;
        if (docFile) {
            fileUrl = await uploadFile(docFile);
        }
      
        const slug = generateSlug(values.title);
        const dataToSave = { ...values, slug, imageUrl, fileUrl };

        if (editingEntry && editingEntry !== 'new') {
            const entryRef = doc(db, "library", editingEntry.id);
            await updateDoc(entryRef, dataToSave);
            toast({ title: "Uğurlu", description: "Material yeniləndi." });
        } else {
            await addDoc(collection(db, "library"), dataToSave);
            toast({ title: "Uğurlu", description: "Yeni material əlavə edildi." });
        }
        
        await fetchLibraryEntries();
        setEditingEntry(null);
    } catch (error) {
      console.error("Error saving entry: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteDoc(doc(db, "library", entryId));
      toast({ title: "Uğurlu", description: "Material silindi." });
      fetchLibraryEntries();
    } catch (error) {
      console.error("Error deleting entry: ", error);
      toast({ title: "Xəta", description: "Materialı silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kitabxananı İdarə Et</h1>
          <p className="text-muted-foreground">Yeni kitab, məqalə və ya digər materiallar əlavə edin.</p>
        </div>
        <Button onClick={() => setEditingEntry(editingEntry === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
           {editingEntry === 'new' ? "Formu Bağla" : "Yeni Material Əlavə Et"}
        </Button>
      </div>

       {editingEntry && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingEntry === 'new' ? "Yeni Material Yarat" : "Materialı Redaktə Et"}</CardTitle>
            <CardDescription>
                Materialın məlumatlarını daxil edin və ya yeniləyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LibraryForm 
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
          <CardTitle>Kitabxana Siyahısı</CardTitle>
           <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Materialları axtar..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : filteredEntries.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {filteredEntries.map((entry) => (
                    <AccordionItem value={entry.id} key={entry.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                               <div className="flex items-center gap-4">
                                     <img
                                        alt={entry.title}
                                        className="aspect-[3/4] rounded-md object-cover"
                                        height="48"
                                        src={entry.imageUrl || "https://placehold.co/48x64.png"}
                                        width="36"
                                      />
                                    <div className="text-left">
                                      <p className="font-medium">{entry.title}</p>
                                      <p className="text-sm text-muted-foreground">{entry.category}</p>
                                    </div>
                                </div>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, materialı serverlərimizdən həmişəlik siləcək.
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
                <Library className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir material tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
