"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialsForm, SocialLinks } from "./socials-form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SocialsAdminPage() {
  const [socials, setSocials] = useState<SocialLinks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocials = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "socials", "links");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocials(docSnap.data() as SocialLinks);
        } else {
          setSocials({ x: '', tiktok: '', instagram: '', facebook: '', whatsapp: '' });
        }
      } catch (error) {
        console.error("Error fetching social links: ", error);
        toast({ title: "Xəta", description: "Sosial hesab linklərini yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocials();
  }, [toast]);

  const handleFormSubmit = async (values: SocialLinks) => {
    try {
      const docRef = doc(db, "socials", "links");
      await setDoc(docRef, values, { merge: true });
      toast({ title: "Uğurlu", description: "Sosial hesab linkləri yeniləndi." });
      setSocials(values);
    } catch (error) {
      console.error("Error saving social links: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sosial Hesabları İdarə Et</h1>
        <p className="text-muted-foreground">Saytın altbilgisində görünən sosial media linklərini yeniləyin.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sosial Media Linkləri</CardTitle>
          <CardDescription>Bütün linklərin tam URL olduğundan əmin olun (məs., https://x.com/username).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
            </div>
          ) : (
            <SocialsForm
              onSubmit={handleFormSubmit}
              initialData={socials}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
