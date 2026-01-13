
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, Shield } from "lucide-react";
import { AdminForm, Admin } from "./admin-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminsAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<Admin | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "admins"));
      const querySnapshot = await getDocs(q);
      const adminList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }) as Admin);
      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins: ", error);
      toast({ title: "Xəta", description: "Adminləri yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleFormSubmit = async (values: Omit<Admin, "id">) => {
    try {
      if (editingAdmin && editingAdmin !== 'new') {
        const adminRef = doc(db, "admins", editingAdmin.id);
        const dataToUpdate: Partial<Admin> = { email: values.email };
        if (values.password) {
            dataToUpdate.password = values.password;
        }
        await updateDoc(adminRef, dataToUpdate);
        toast({ title: "Uğurlu", description: "Admin məlumatları yeniləndi." });
      } else {
        const q = query(collection(db, "admins"), where("email", "==", values.email));
        const existing = await getDocs(q);
        if (!existing.empty) {
          toast({ title: "Xəta", description: "Bu e-poçt ilə artıq admin mövcuddur.", variant: "destructive" });
          return;
        }
        await addDoc(collection(db, "admins"), values);
        toast({ title: "Uğurlu", description: "Yeni admin əlavə edildi." });
      }
      
      await fetchAdmins();
      setEditingAdmin(null);
    } catch (error) {
      console.error("Error saving admin: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };


  const handleDelete = async (adminId: string) => {
    try {
      await deleteDoc(doc(db, "admins", adminId));
      toast({ title: "Uğurlu", description: "Admin silindi." });
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin: ", error);
      toast({ title: "Xəta", description: "Admini silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Hesablarını İdarə Et</h1>
          <p className="text-muted-foreground">Yeni admin əlavə edin, redaktə edin və ya silin.</p>
        </div>
        <Button onClick={() => setEditingAdmin(editingAdmin === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingAdmin === 'new' ? "Formu Bağla" : "Yeni Admin Əlavə Et"}
        </Button>
      </div>

       {editingAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingAdmin === 'new' ? "Yeni Admin Yarat" : "Admini Redaktə Et"}</CardTitle>
          </CardHeader>
          <CardContent>
             <AdminForm 
              key={editingAdmin === 'new' ? 'new-admin' : editingAdmin.id}
              onSubmit={handleFormSubmit} 
              initialData={editingAdmin === 'new' ? null : editingAdmin} 
              onClose={() => setEditingAdmin(null)} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Admin Siyahısı</CardTitle>
          <CardDescription>Sistemə giriş icazəsi olan hesablar.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : admins.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {admins.map((admin) => (
                    <AccordionItem value={admin.id} key={admin.id}>
                        <AccordionTrigger>
                           <div className="flex items-center gap-4">
                                <Shield className="h-5 w-5 text-primary"/>
                                <span className="font-medium">{admin.email}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingAdmin(admin)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, admin hesabını sistemdən həmişəlik siləcək.
                                        </AlertDialogDesc>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(admin.id)}>Davam et</AlertDialogAction>
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
                <Shield className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir admin tapılmadı.</h3>
                 <p>Sistemə giriş üçün yeni admin yarada bilərsiniz.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
