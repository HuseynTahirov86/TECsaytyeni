
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Inbox, GraduationCap, Download, FileText, FileOutput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { exportToExcel } from "@/lib/utils";

interface FacultyDocument {
    id: string;
    faculty: string;
    fileUrl: string;
    submittedAt: Timestamp;
}

export default function FacultyDocumentsPage() {
  const [documents, setDocuments] = useState<FacultyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "facultyDocuments"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const docList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as FacultyDocument);
        setDocuments(docList);
      } catch (error) {
        console.error("Error fetching faculty documents: ", error);
        toast({ title: "Xəta", description: "Sənədləri yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "facultyDocuments", id));
      toast({ title: "Uğurlu", description: "Sənəd silindi." });
      setDocuments(documents.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({ title: "Xəta", description: "Sənədi silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleExport = () => {
    const dataToExport = documents.map(doc => ({
      'Fakültə': doc.faculty,
      'Tarix': doc.submittedAt ? doc.submittedAt.toDate().toLocaleString('az-AZ') : 'Bilinmir',
      'Fayl URL': doc.fileUrl,
    }));
    exportToExcel(dataToExport, "Fakültə_Sənədləri");
  };

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fakültə Sənədləri</CardTitle>
            <CardDescription>Burada təqdim edilmiş bütün fakültə sənədlərini görə bilərsiniz.</CardDescription>
          </div>
           <Button onClick={handleExport} disabled={isLoading || documents.length === 0}>
                <FileOutput className="mr-2 h-4 w-4" /> Excel-ə İxrac Et
            </Button>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : documents.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {documents.map((doc) => (
                    <AccordionItem value={doc.id} key={doc.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4 text-left">
                                     <GraduationCap className="h-5 w-5 text-primary"/>
                                    <div className="font-medium w-64 truncate">{doc.faculty}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="hidden sm:inline-flex">
                                        {isClient && doc.submittedAt ? doc.submittedAt.toDate().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                           <div className="space-y-6">
                            <div className="prose prose-sm max-w-none">
                                <h4 className="font-semibold">Təyinat</h4>
                                <p>TETİ nəticələri ilə bağlı Fakültə Elmi Şurasının protokolundan çıxarış</p>
                            </div>
                             <div className="flex justify-between items-center pt-4 border-t">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Yüklə
                                    </Link>
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
                                        <AlertDialogDescription>
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, sənədi həmişəlik siləcək.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(doc.id)}>Davam et</AlertDialogAction>
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
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Inbox className="h-10 w-10 mb-2"/>
                    <h3 className="text-xl font-semibold">Heç bir sənəd tapılmadı</h3>
                    <p>Sistemə hələ heç bir fakültə sənədi daxil edilməyib.</p>
                </div>
            )}
        </CardContent>
      </Card>
  );
}
