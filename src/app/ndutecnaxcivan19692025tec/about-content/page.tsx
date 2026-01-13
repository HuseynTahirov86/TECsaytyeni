
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AboutContentForm, type AboutContent } from "./form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutContentAdminPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "siteContent", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as AboutContent);
        } else {
          setContent({ mainContent: "" });
        }
      } catch (error) {
        console.error("Error fetching about content: ", error);
        toast({ title: "Xəta", description: "Məzmunu yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [toast]);

  const handleFormSubmit = async (values: AboutContent) => {
    try {
      const docRef = doc(db, "siteContent", "about");
      await setDoc(docRef, values);
      toast({ title: "Uğurlu", description: "Haqqımızda səhifəsinin məzmunu yeniləndi." });
      setContent(values);
    } catch (error) {
      console.error("Error saving about content: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Haqqımızda Səhifəsini İdarə Et</h1>
        <p className="text-muted-foreground">Səhifədə görünən əsas mətn bloklarını redaktə edin.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Səhifə Məzmunu</CardTitle>
          <CardDescription>
            Aşağıdakı mətn sahəsindəki məzmun birbaşa "Haqqımızda" səhifəsində göstəriləcək.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
          ) : (
            <AboutContentForm
              onSubmit={handleFormSubmit}
              initialData={content}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
