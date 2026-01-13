
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Inbox, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { User as UserType } from "@/lib/definitions";


const formatDate = (timestamp: Timestamp): string => {
    if (!timestamp) return 'Bilinmir';
    const date = timestamp.toDate();
    if (isNaN(date.getTime())) return 'Bilinmir';
    
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    };
    return new Intl.DateTimeFormat('az-AZ', options).format(date);
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }) as UserType);
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast({ title: "Xəta", description: "İstifadəçiləri yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast({ title: "Uğurlu", description: "İstifadəçi silindi." });
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast({ title: "Xəta", description: "İstifadəçini silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Təlim Sistemi İstifadəçiləri</h1>
        <p className="text-muted-foreground">Təlimlər üçün qeydiyyatdan keçmiş istifadəçilər.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>İstifadəçi Siyahısı</CardTitle>
          <CardDescription>Burada sistemdə qeydiyyatdan keçmiş bütün təlim istifadəçilərini görə bilərsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : users.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {users.map((user) => (
                    <AccordionItem value={user.id} key={user.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4 text-left">
                                    <User className="h-5 w-5 text-primary"/>
                                    <div className="font-medium w-48 truncate">{user.name}</div>
                                    <div className="text-muted-foreground w-64 truncate hidden md:block">{user.email}</div>
                                </div>
                                <Badge variant="outline" className="hidden sm:inline-flex">
                                    {user.designation}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                           <div className="flex justify-between items-start">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                    <p><strong>İxtisas:</strong> {user.specialization}</p>
                                    <p><strong>Kurs:</strong> {user.course}</p>
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
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Inbox className="h-10 w-10 mb-2"/>
                    <h3 className="text-xl font-semibold">Heç bir istifadəçi tapılmadı</h3>
                    <p>Sistemdə hələ heç bir təlim istifadəçisi qeydiyyatdan keçməyib.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
