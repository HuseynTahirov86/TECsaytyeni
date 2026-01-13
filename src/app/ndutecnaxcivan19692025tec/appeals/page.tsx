
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Inbox, User, Mail, Phone, BookOpen, Clock, Building, GraduationCap, FileOutput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatDate, exportToExcel } from "@/lib/utils";

interface Appeal {
    id: string;
    fullName: string;
    faculty: string;
    specialization: string;
    course: string;
    phone: string;
    email: string;
    subject: "Sual" | "Təklif" | "Şikayət";
    message: string;
    submittedAt: Timestamp;
}

export default function AppealsAdminPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const fetchAppeals = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "chairmanAppeals"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const appealList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as Appeal);
        setAppeals(appealList);
      } catch (error) {
        console.error("Error fetching appeals: ", error);
        toast({ title: "Xəta", description: "Müraciətləri yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppeals();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "chairmanAppeals", id));
      toast({ title: "Uğurlu", description: "Müraciət silindi." });
      setAppeals(appeals.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting appeal: ", error);
      toast({ title: "Xəta", description: "Müraciəti silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleExport = () => {
    const dataToExport = appeals.map(appeal => ({
      'Ad, Soyad': appeal.fullName,
      'Email': appeal.email,
      'Telefon': appeal.phone,
      'Fakültə': appeal.faculty,
      'İxtisas': appeal.specialization,
      'Kurs': appeal.course,
      'Mövzu': appeal.subject,
      'Mətn': appeal.message,
      'Tarix': appeal.submittedAt ? appeal.submittedAt.toDate().toLocaleString('az-AZ') : 'Bilinmir',
    }));
    exportToExcel(dataToExport, "Sədrə_Müraciətlər");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sədrə Müraciətlər</h1>
        <p className="text-muted-foreground">Sayt vasitəsilə soraq ünvanlanan müraciətlər.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Müraciətlər Siyahısı</CardTitle>
                <CardDescription>Burada sədərə göndərilən bütün müraciətləri görə bilərsiniz.</CardDescription>
            </div>
            <Button onClick={handleExport} disabled={isLoading || appeals.length === 0}>
                <FileOutput className="mr-2 h-4 w-4" /> Excel-ə İxrac Et
            </Button>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : appeals.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {appeals.map((appeal) => (
                    <AccordionItem value={appeal.id} key={appeal.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4 text-left">
                                     <Badge 
                                        variant={appeal.subject === 'Şikayət' ? 'destructive' : (appeal.subject === 'Sual' ? 'secondary' : 'default')}
                                        className="w-24 justify-center"
                                     >
                                        {appeal.subject}
                                    </Badge>
                                    <div className="font-medium w-48 truncate">{appeal.fullName}</div>
                                    <div className="text-muted-foreground w-64 truncate hidden md:block">{appeal.faculty}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="hidden sm:inline-flex">
                                        {isClient && appeal.submittedAt ? formatDate(appeal.submittedAt.toDate()) : '...'}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                           <div className="space-y-4">
                             <div className="flex justify-between items-start">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                    <p className="flex items-center gap-2"><User className="h-4 w-4 text-primary"/><strong>Müraciətçi:</strong>{appeal.fullName}</p>
                                    <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary"/><strong>E-poçt:</strong><a href={`mailto:${appeal.email}`} className="text-primary hover:underline">{appeal.email}</a></p>
                                    <p className="flex items-center gap-2"><Building className="h-4 w-4 text-primary"/><strong>Fakültə:</strong>{appeal.faculty}</p>
                                    <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary"/><strong>Telefon:</strong>{appeal.phone}</p>
                                    <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary"/><strong>İxtisas:</strong>{appeal.specialization}</p>
                                    <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary"/><strong>Kurs:</strong>{appeal.course}</p>
                                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/><strong>Tarix:</strong>{isClient && appeal.submittedAt ? appeal.submittedAt.toDate().toLocaleString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '...'}</p>
                                </div>
                             </div>
                             <div className="prose prose-sm max-w-none pt-4 border-t mt-4">
                                <h4 className="font-semibold mb-2">Müraciətin Mətni:</h4>
                                <p className="whitespace-pre-wrap">{appeal.message}</p>
                            </div>
                            <div className="pt-4 border-t flex justify-end">
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, müraciəti həmişəlik siləcək.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(appeal.id)}>Davam et</AlertDialogAction>
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
                    <h3 className="text-xl font-semibold">Heç bir müraciət tapılmadı</h3>
                    <p>Sədrə hələ heç bir müraciət daxil olmayıb.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
