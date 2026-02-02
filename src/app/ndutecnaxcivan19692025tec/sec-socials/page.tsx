"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SecSocialsForm, SecSocialLinks } from "./form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SecSocialsAdminPage() {
  const [socials, setSocials] = useState<SecSocialLinks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocials = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "socials", "sec-links");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocials(docSnap.data() as SecSocialLinks);
        } else {
          setSocials({ instagram: '', facebook: '' });
        }
      } catch (error) {
        console.error("Error fetching ŞEC social links: ", error);
        toast({ title: "Xəta", description: "ŞEC sosial hesab linklərini yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocials();
  }, [toast]);

  const handleFormSubmit = async (values: SecSocialLinks) => {
    try {
      const docRef = doc(db, "socials", "sec-links");
      await setDoc(docRef, values, { merge: true });
      toast({ title: "Uğurlu", description: "ŞEC sosial hesab linkləri yeniləndi." });
      setSocials(values);
    } catch (error) {
      console.error("Error saving ŞEC social links: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ŞEC Sosial Hesablarını İdarə Et</h1>
        <p className="text-muted-foreground">ŞEC saytının altbilgisində görünən sosial media linklərini yeniləyin.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>ŞEC Sosial Media Linkləri</CardTitle>
          <CardDescription>Bütün linklərin tam URL olduğundan əmin olun (məs., https://facebook.com/username).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24 ml-auto" />
            </div>
          ) : (
            <SecSocialsForm
              onSubmit={handleFormSubmit}
              initialData={socials}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
