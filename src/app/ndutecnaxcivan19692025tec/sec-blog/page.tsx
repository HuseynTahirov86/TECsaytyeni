
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, Newspaper, Search } from "lucide-react";
import { SecNewsForm, SecNewsArticle } from "./form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, generateSlug, uploadFile } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function SecNewsPage() {
  const [news, setNews] = useState<SecNewsArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<SecNewsArticle | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "secNews"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const newsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
        } as SecNewsArticle;
      });
      setNews(newsList);
    } catch (error) {
      console.error("Error fetching SEC news: ", error);
      toast({ title: "Xəta", description: "ŞEC xəbərlərini yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFormSubmit = async (values: Omit<SecNewsArticle, "id">, imageFile: File | null) => {
    try {
      let imageUrl = values.imageUrl;

      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'sec-images');
      }
      
      const slug = generateSlug(values.title);
      const dataToSave = { ...values, slug, imageUrl };


      if (editingArticle && editingArticle !== 'new') {
        const articleRef = doc(db, "secNews", editingArticle.id);
        await updateDoc(articleRef, dataToSave);
        toast({ title: "Uğurlu", description: "Xəbər yeniləndi." });
      } else {
        await addDoc(collection(db, "secNews"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni xəbər əlavə edildi." });
      }
      
      await fetchNews();
      setEditingArticle(null);
    } catch (error) {
      console.error("Error saving article: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (articleId: string) => {
    try {
      await deleteDoc(doc(db, "secNews", articleId));
      toast({ title: "Uğurlu", description: "Xəbər silindi." });
      fetchNews();
    } catch (error) {
      console.error("Error deleting article: ", error);
      toast({ title: "Xəta", description: "Xəbəri silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const filteredNews = news.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">ŞEC Bloqunu İdarə Et</h1>
          <p className="text-muted-foreground">Şagird Elmi Cəmiyyəti üçün xəbərlər əlavə edin, redaktə edin və ya silin.</p>
        </div>
        <Button onClick={() => setEditingArticle(editingArticle === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingArticle === 'new' ? "Formu Bağla" : "Yeni Xəbər Əlavə Et"}
        </Button>
      </div>

      {editingArticle && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingArticle === 'new' ? "Yeni ŞEC Xəbəri Yarat" : "Xəbəri Redaktə Et"}</CardTitle>
            <CardDescription>
                Xəbərin məlumatlarını daxil edin və ya yeniləyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecNewsForm 
              key={editingArticle === 'new' ? 'new-article' : editingArticle.id}
              onSubmit={handleFormSubmit} 
              initialData={editingArticle === 'new' ? null : editingArticle} 
              onClose={() => setEditingArticle(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>ŞEC Xəbərlər Siyahısı</CardTitle>
           <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Xəbərləri axtar..."
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
           ) : filteredNews.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {filteredNews.map((article) => (
                    <AccordionItem value={article.id} key={article.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                               <div className="flex items-center gap-4 text-left">
                                     <img
                                        alt={article.title}
                                        className="aspect-square rounded-md object-cover"
                                        height="40"
                                        src={article.imageUrl || "https://placehold.co/40x40.png"}
                                        width="40"
                                      />
                                    <div>
                                      <p className="font-medium">{article.title}</p>
                                      <p className="text-sm text-muted-foreground">{article.category}</p>
                                    </div>
                               </div>
                               <span className="text-sm text-muted-foreground hidden md:inline-block">{formatDate(article.date)}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingArticle(article)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, xəbəri serverlərimizdən həmişəlik siləcək.
                                        </AlertDialogDesc>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(article.id)}>Davam et</AlertDialogAction>
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
                <Newspaper className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir xəbər tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
