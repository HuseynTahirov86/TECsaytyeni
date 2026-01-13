
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, Timestamp, orderBy, query, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Inbox, CheckCircle, Clock, User, FileText, Phone, Download, FileOutput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { exportToExcel } from "@/lib/utils";

interface LawSubmission {
    id: string;
    firstName: string;
    lastName: string;
    otherAuthors?: string;
    articleTitle: string;
    fieldOfLaw: string;
    pageCount: number;
    academicInfo: string;
    email: string;
    phone: string;
    copyrightPermission: boolean;
    articleFileUrl: string;
    reviewFileUrls: string[];
    notes?: string;
    submittedAt: Timestamp;
    status: 'gözləmədə' | 'təsdiqləndi';
}

export default function LawJournalAdminPage() {
  const [submissions, setSubmissions] = useState<LawSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "lawSubmissions"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const submissionList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as LawSubmission);
        setSubmissions(submissionList);
      } catch (error) {
        console.error("Error fetching submissions: ", error);
        toast({ title: "Xəta", description: "Məqalələri yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "lawSubmissions", id));
      toast({ title: "Uğurlu", description: "Məqalə silindi." });
      setSubmissions(submissions.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting submission: ", error);
      toast({ title: "Xəta", description: "Məqaləni silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const submissionRef = doc(db, "lawSubmissions", id);
      await updateDoc(submissionRef, { status: 'təsdiqləndi' });
      toast({ title: "Uğurlu", description: "Məqalə təsdiqləndi." });
      const updatedSubmissions = submissions.map(s => s.id === id ? { ...s, status: 'təsdiqləndi' } as LawSubmission : s);
      setSubmissions(updatedSubmissions);
    } catch (error) {
      console.error("Error approving submission: ", error);
      toast({ title: "Xəta", description: "Məqaləni təsdiqləyərkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleExport = () => {
    const dataToExport = submissions.map(sub => ({
      'Ad, Soyad': `${sub.firstName} ${sub.lastName}`,
      'Digər Müəlliflər': sub.otherAuthors || 'Yoxdur',
      'Məqalə Adı': sub.articleTitle,
      'Hüquq Sahəsi': sub.fieldOfLaw,
      'Səhifə Sayı': sub.pageCount,
      'Akademik Məlumat': sub.academicInfo,
      'Email': sub.email,
      'Telefon': sub.phone,
      'Status': sub.status,
      'Məqalə Faylı': sub.articleFileUrl,
      'Rəy Faylları': sub.reviewFileUrls.join(', '),
      'Qeydlər': sub.notes || 'Yoxdur',
      'Tarix': sub.submittedAt ? sub.submittedAt.toDate().toLocaleString('az-AZ') : 'Bilinmir',
    }));
    exportToExcel(dataToExport, "Hüquq_Jurnalı_Məqalələri");
  };


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tələbə Hüquq Jurnalı</h1>
        <p className="text-muted-foreground">Jurnala göndərilən məqalələrin siyahısı.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Göndərilən Məqalələr</CardTitle>
            <CardDescription>Burada təsdiq gözləyən və ya təsdiqlənmiş məqalələri idarə edə bilərsiniz.</CardDescription>
          </div>
          <Button onClick={handleExport} disabled={isLoading || submissions.length === 0}>
            <FileOutput className="mr-2 h-4 w-4" /> Excel-ə İxrac Et
          </Button>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : submissions.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {submissions.map((submission) => (
                    <AccordionItem value={submission.id} key={submission.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4 text-left">
                                    <Badge variant={submission.status === 'təsdiqləndi' ? 'default' : 'secondary'} className="w-28 justify-center">
                                       {submission.status === 'təsdiqləndi' ? <CheckCircle className="mr-2 h-4 w-4"/> : <Clock className="mr-2 h-4 w-4"/>}
                                       {submission.status}
                                    </Badge>
                                    <div className="font-medium w-48 truncate">{`${submission.firstName} ${submission.lastName}`}</div>
                                    <div className="text-muted-foreground w-64 truncate">{submission.articleTitle}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <Badge variant="outline" className="hidden sm:inline-flex">
                                        {isClient && submission.submittedAt ? submission.submittedAt.toDate().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                           <div className="space-y-4">
                             <div className="flex justify-between items-start">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                    <p className="flex items-center gap-2 font-semibold"><User className="h-4 w-4 text-primary"/>Müəllif:</p>
                                    <p>{`${submission.firstName} ${submission.lastName}`}</p>

                                    <p className="font-semibold">Digər müəlliflər:</p>
                                    <p>{submission.otherAuthors || "Yoxdur"}</p>

                                    <p className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-primary"/>Hüquq sahəsi:</p>
                                     <p>{submission.fieldOfLaw}</p>

                                    <p className="font-semibold">Səhifə sayı:</p>
                                    <p>{submission.pageCount}</p>
                                    
                                    <p className="font-semibold">E-poçt:</p>
                                    <p><a href={`mailto:${submission.email}`} className="text-primary hover:underline">{submission.email}</a></p>

                                    <p className="flex items-center gap-2 font-semibold"><Phone className="h-4 w-4 text-primary"/>Telefon:</p>
                                    <p>{submission.phone}</p>
                                    
                                    <p className="font-semibold">Göndərilmə tarixi:</p>
                                    <p>{isClient && submission.submittedAt ? submission.submittedAt.toDate().toLocaleString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '...'}</p>
                                    
                                    <p className="font-semibold">Müəlliflik hüququ:</p>
                                    <p><span className={submission.copyrightPermission ? 'text-green-600' : 'text-red-600'}>{submission.copyrightPermission ? 'Razılaşıb' : 'Razılaşmayıb'}</span></p>
                                </div>
                                <div className="flex flex-col gap-2">
                                     {submission.status === 'gözləmədə' && (
                                        <Button size="sm" onClick={() => handleApprove(submission.id)}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Təsdiqlə
                                        </Button>
                                    )}
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
                                                Bu əməliyyat geri qaytarıla bilməz. Bu, məqaləni həmişəlik siləcək.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(submission.id)}>Davam et</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                             </div>
                             <div className="prose prose-sm max-w-none pt-4 border-t mt-4">
                                <h4 className="font-semibold mb-2">Akademik Məlumat:</h4>
                                <p className="whitespace-pre-wrap">{submission.academicInfo}</p>
                             </div>
                             <div className="prose prose-sm max-w-none pt-4 border-t mt-4">
                                <h4 className="font-semibold mb-2">Məqalə Faylı:</h4>
                                {submission.articleFileUrl ? (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={submission.articleFileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Faylı Yüklə
                                        </Link>
                                    </Button>
                                ) : (
                                    <p className="text-muted-foreground">Fayl yüklənməyib.</p>
                                )}
                            </div>
                             <div className="prose prose-sm max-w-none pt-4 border-t mt-4">
                                <h4 className="font-semibold mb-2">Rəy Faylları:</h4>
                                {submission.reviewFileUrls && submission.reviewFileUrls.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {submission.reviewFileUrls.map((url, index) => (
                                            <Button asChild variant="outline" size="sm" key={index}>
                                                <Link href={url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    {index + 1}-ci Rəyi Yüklə
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-xs">Heç bir rəy faylı yüklənməyib.</p>
                                )}
                            </div>
                            {submission.notes && (
                                <div className="prose prose-sm max-w-none pt-4 border-t mt-4">
                                    <h4 className="font-semibold mb-2">Qeydlər:</h4>
                                    <p className="whitespace-pre-wrap">{submission.notes}</p>
                                </div>
                            )}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Inbox className="h-10 w-10 mb-2"/>
                    <h3 className="text-xl font-semibold">Heç bir məqalə tapılmadı</h3>
                    <p>Bu jurnal üçün hələ heç bir məqalə göndərilməyib.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
