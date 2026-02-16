
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";
import { SecTeamForm, SecTeamMember } from "./form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDesc, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";
import Image from "next/image";

export default function SecTeamAdminPage() {
  const [members, setMembers] = useState<SecTeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<SecTeamMember | 'new' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "secTeamMembers"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const memberList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }) as SecTeamMember);
      setMembers(memberList);
    } catch (error) {
      console.error("Error fetching SEC team members: ", error);
      toast({ title: "Xəta", description: "ŞEC komanda üzvlərini yükləyərkən problem yarandı.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleFormSubmit = async (values: Omit<SecTeamMember, "id">, imageFile: File | null) => {
    try {
      let avatarUrl = values.avatarUrl;
      if (imageFile) {
        avatarUrl = await uploadFile(imageFile, 'sec-images');
      }

      const dataToSave = { ...values, avatarUrl };

      if (editingMember && editingMember !== 'new') {
        const memberRef = doc(db, "secTeamMembers", editingMember.id);
        await updateDoc(memberRef, dataToSave);
        toast({ title: "Uğurlu", description: "Komanda üzvü yeniləndi." });
      } else {
        await addDoc(collection(db, "secTeamMembers"), dataToSave);
        toast({ title: "Uğurlu", description: "Yeni komanda üzvü əlavə edildi." });
      }
      
      await fetchMembers();
      setEditingMember(null);
    } catch (error) {
      console.error("Error saving member: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  const handleDelete = async (memberId: string) => {
    try {
      await deleteDoc(doc(db, "secTeamMembers", memberId));
      toast({ title: "Uğurlu", description: "Komanda üzvü silindi." });
      await fetchMembers();
    } catch (error) {
      console.error("Error deleting member: ", error);
      toast({ title: "Xəta", description: "Üzvü silərkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">ŞEC Komandasını İdarə Et</h1>
          <p className="text-muted-foreground">Şagird Elmi Cəmiyyəti komandasına yeni üzvlər əlavə edin, redaktə edin və ya silin.</p>
        </div>
        <Button onClick={() => setEditingMember(editingMember === 'new' ? null : 'new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingMember === 'new' ? "Formu Bağla" : "Yeni Üzv Əlavə Et"}
        </Button>
      </div>

       {editingMember && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingMember === 'new' ? "Yeni ŞEC Üzvü Yarat" : "Üzvü Redaktə Et"}</CardTitle>
            <CardDescription>
                ŞEC komanda üzvünün məlumatlarını daxil edin və ya yeniləyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecTeamForm
              key={editingMember === 'new' ? 'new-member' : editingMember.id}
              onSubmit={handleFormSubmit}
              initialData={editingMember === 'new' ? null : editingMember}
              onClose={() => setEditingMember(null)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>ŞEC Komanda Üzvləri</CardTitle>
          <CardDescription>"ŞEC Haqqında" səhifəsində görünən üzvlər.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
           ) : members.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {members.map((member) => (
                    <AccordionItem value={member.id} key={member.id}>
                        <AccordionTrigger>
                           <div className="flex items-center justify-between w-full pr-4">
                               <div className="flex items-center gap-4">
                                     <Image
                                        alt={member.name}
                                        className="aspect-square rounded-full object-cover"
                                        height="40"
                                        src={member.avatarUrl || "https://placehold.co/40x40.png"}
                                        width="40"
                                      />
                                    <div className="text-left">
                                      <p className="font-medium">{member.name}</p>
                                      <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                               </div>
                                <span className="text-sm text-muted-foreground hidden md:inline-block">Sıra: {member.order}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-b-md flex items-center gap-2">
                                <Button size="sm" onClick={() => setEditingMember(member)}>
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
                                            Bu əməliyyat geri qaytarıla bilməz. Bu, üzvü sistemdən həmişəlik siləcək.
                                        </AlertDialogDesc>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(member.id)}>Davam et</AlertDialogAction>
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
                <Users className="h-10 w-10 mb-2"/>
                <h3 className="text-xl font-semibold">Heç bir komanda üzvü tapılmadı.</h3>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
