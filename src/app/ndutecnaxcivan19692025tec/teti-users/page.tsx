
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Inbox, User, Users, BookOpen, FileOutput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { TetiUser } from "@/lib/definitions";
import { exportToExcel } from "@/lib/utils";

export default function TetiUsersAdminPage() {
  const [users, setUsers] = useState<TetiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "tetiUsers"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as TetiUser);
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching TETİ users: ", error);
        toast({ title: "Xəta", description: "İstifadəçiləri yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tetiUsers", id));
      toast({ title: "Uğurlu", description: "İstifadəçi silindi." });
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast({ title: "Xəta", description: "İstifadəçini silərkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleExport = () => {
    const dataToExport = users.map(user => ({
      'Ad, Soyad, Ata adı': user.fullName,
      'Email': user.email,
      'Telefon': user.phone,
      'Fakültə': user.faculty,
      'İxtisas': user.specialization,
      'Tədris Dili': user.studyLanguage,
      'Elmi Rəhbərlər': user.advisors.join(', '),
      'Fənlər': user.subjects.join(', '),
      'Mövzular': user.topics?.join(', ') || 'Yoxdur',
      'Qeydiyyat Tarixi': user.createdAt ? user.createdAt.toDate().toLocaleString('az-AZ') : 'Bilinmir',
    }));
    exportToExcel(dataToExport, "TETİ_İstifadəçiləri");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">TETİ İstifadəçiləri</h1>
        <p className="text-muted-foreground">TETİ şəxsi kabineti üçün qeydiyyatdan keçmiş tələbələr.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>İstifadəçi Siyahısı</CardTitle>
            <CardDescription>Burada sistemdə qeydiyyatdan keçmiş bütün tələbələri görə bilərsiniz.</CardDescription>
          </div>
          <Button onClick={handleExport} disabled={isLoading || users.length === 0}>
            <FileOutput className="mr-2 h-4 w-4" /> Excel-ə İxrac Et
          </Button>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : users.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {users.map((user) => (
                    <AccordionItem value={user.id} key={user.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4 text-left">
                                    <User className="h-5 w-5 text-primary"/>
                                    <div className="font-medium w-48 truncate">{user.fullName}</div>
                                    <div className="text-muted-foreground w-64 truncate hidden md:block">{user.faculty}</div>
                                </div>
                                <Badge variant="outline" className="hidden sm:inline-flex">
                                    {user.specialization}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                           <div className="space-y-4">
                             <div className="flex justify-between items-start">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                    <p><strong>E-poçt:</strong> <a href={`mailto:${user.email}`} className="text-primary hover:underline">{user.email}</a></p>
                                    <p><strong>Telefon:</strong> {user.phone}</p>
                                    <p><strong>Tədris dili:</strong> {user.studyLanguage}</p>
                                    <p><strong>Elmi rəhbərlər:</strong> {user.advisors.join(', ')}</p>
                                    <p><strong>Fənlər:</strong> {user.subjects.join(', ')}</p>
                                    <p><strong>Mövzular:</strong> {user.topics?.join(', ') || 'Yoxdur'}</p>
                                </div>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, istifadəçini və onun məlumatlarını həmişəlik siləcək.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(user.id)}>Davam et</AlertDialogAction>
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
                    <h3 className="text-xl font-semibold">Heç bir istifadəçi tapılmadı</h3>
                    <p>Sistemdə hələ heç bir TETİ istifadəçisi qeydiyyatdan keçməyib.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
