
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChairmanForm, type Chairman } from "./form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";

export default function ChairmanAdminPage() {
  const [chairman, setChairman] = useState<Chairman | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChairman = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "siteContent", "chairman");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChairman(docSnap.data() as Chairman);
        } else {
          // Provide default structure if it doesn't exist
          setChairman({ 
            name: "",
            role: "Sədr",
            bio: "",
            avatarUrl: "",
            avatarHint: "",
            linkedinUrl: "",
            instagramUrl: "",
            facebookUrl: "",
          });
        }
      } catch (error) {
        console.error("Error fetching chairman data: ", error);
        toast({ title: "Xəta", description: "Sədr məlumatlarını yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChairman();
  }, [toast]);

  const handleFormSubmit = async (values: Chairman, imageFile: File | null) => {
    try {
      let avatarUrl = values.avatarUrl;
      if (imageFile) {
        avatarUrl = await uploadFile(imageFile);
      }

      const dataToSave = { ...values, avatarUrl };
      
      const docRef = doc(db, "siteContent", "chairman");
      await setDoc(docRef, dataToSave);
      toast({ title: "Uğurlu", description: "Sədr məlumatları yeniləndi." });
      setChairman(dataToSave);
    } catch (error) {
      console.error("Error saving chairman data: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sədr Məlumatlarını İdarə Et</h1>
        <p className="text-muted-foreground">"Haqqımızda" səhifəsində görünən sədr məlumatlarını redaktə edin.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>TEC Sədri</CardTitle>
          <CardDescription>
            Sədrin məlumatlarını daxil edin. Bu məlumatlar "Rəhbərlik" səhifəsində göstəriləcək.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-40 rounded-full mx-auto" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
          ) : (
            <ChairmanForm
              onSubmit={handleFormSubmit}
              initialData={chairman}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
