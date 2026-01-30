"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Inbox, User, Mail, Phone, BookOpen, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatDate } from "@/lib/utils";

interface SecAppeal {
    id: string;
    fullName: string;
    class: string;
    subject: string;
    message: string;
    submittedAt: Timestamp;
}

export default function SecAppealsAdminPage() {
  const [appeals, setAppeals] = useState<SecAppeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const fetchAppeals = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "secChairmanAppeals"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const appealList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as SecAppeal);
        setAppeals(appealList);
      } catch (error) {
        console.error("Error fetching SEC appeals: ", error);
        toast({ title: "Xəta", description: "ŞEC müraciətlərini yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppeals();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "secChairmanAppeals", id));
      toast({ title: "Uğurlu", description: "Müraciət silindi." });
      setAppeals(appeals.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting appeal: ", error);
      toast({ title: "Xəta", description: "Müraciəti silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ŞEC Sədrinə Müraciətlər</h1>
        <p className="text-muted-foreground">Şagird Elmi Cəmiyyəti bölməsindən göndərilən müraciətlər.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Müraciətlər Siyahısı</CardTitle>
            <CardDescription>Burada ŞEC sədrinə göndərilən bütün müraciətləri görə bilərsiniz.</CardDescription>
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
                                    <div className="font-medium w-48 truncate">{appeal.fullName} ({appeal.class})</div>
                                    <div className="text-muted-foreground w-64 truncate hidden md:block">{appeal.subject}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {isClient && appeal.submittedAt ? formatDate(appeal.submittedAt.toDate()) : '...'}
                                    </span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                           <div className="space-y-4">
                            <p className="whitespace-pre-wrap">{appeal.message}</p>
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
                    <p>ŞEC sədrinə hələ heç bir müraciət daxil olmayıb.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
