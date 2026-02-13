
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentForm } from "./form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function VisionAdminPage() {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const docRef = doc(db, "siteContent", "about");

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().visionContent || '');
        }
      } catch (error) {
        console.error("Error fetching content: ", error);
        toast({ title: "Xəta", description: "Məzmunu yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [toast]);

  const handleFormSubmit = async (values: { content: string }) => {
    try {
      await updateDoc(docRef, { visionContent: values.content });
      toast({ title: "Uğurlu", description: "Vizyon səhifəsi yeniləndi." });
      setContent(values.content);
    } catch (error) {
      console.error("Error saving content: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">"Vizyonumuz" Səhifəsi</h1>
        <p className="text-muted-foreground">Səhifədə görünən mətn blokunu redaktə edin.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
          ) : (
            <ContentForm
              onSubmit={handleFormSubmit}
              initialContent={content}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
