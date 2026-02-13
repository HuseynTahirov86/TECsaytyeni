"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SecAboutContentForm, type SecAboutContent } from "./form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";

export default function SecAboutContentAdminPage() {
  const [content, setContent] = useState<SecAboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const docPath = "siteContent";
  const docId = "sec-about";

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, docPath, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as SecAboutContent);
        } else {
          setContent({ 
              title: "NDU nəzdində Gimnaziya Şagird Elmi Cəmiyyəti (ŞEC)",
              bannerImageUrl: "/secbanner.png",
              bannerImageHint: "group young students science project",
              mainContent: "<p>Naxçıvan Dövlət Universiteti nəzdindəki Gimnaziyanın Şagird Elmi Cəmiyyəti (ŞEC), istedadlı və elmə marağı olan şagirdləri bir araya gətirərək onların elmi-tədqiqat bacarıqlarını erkən yaşlardan inkişaf etdirmək məqsədi daşıyır. Biz, şagirdlərin akademik potensialını reallaşdırmaq, onlara tədqiqat aparmağın əsaslarını öyrətmək və elmi düşüncə tərzini aşılamaq üçün çalışırıq.</p><p>ŞEC olaraq, gənc nəslin elmə olan həvəsini artırmaq, onları gələcəyin alimləri, mühəndisləri və ixtiraçıları olmağa ruhlandırmaq əsas hədəfimizdir. Bu yolda müxtəlif layihələr, seminarlar, müsabiqələr və ekskursiyalar təşkil edərək onların həm nəzəri biliklərini, həm də praktiki bacarıqlarını gücləndiririk.</p>" 
          });
        }
      } catch (error) {
        console.error("Error fetching ŞEC about content: ", error);
        toast({ title: "Xəta", description: "Məzmunu yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [toast]);

  const handleFormSubmit = async (values: SecAboutContent, imageFile: File | null) => {
    try {
      let bannerImageUrl = values.bannerImageUrl;
      if (imageFile) {
        bannerImageUrl = await uploadFile(imageFile, 'sec-images');
      }
      
      const dataToSave = { ...values, bannerImageUrl };

      const docRef = doc(db, docPath, docId);
      await setDoc(docRef, dataToSave);
      toast({ title: "Uğurlu", description: "ŞEC Haqqımızda səhifəsinin məzmunu yeniləndi." });
      setContent(dataToSave);
    } catch (error) {
      console.error("Error saving ŞEC about content: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ŞEC Haqqında Səhifəsini İdarə Et</h1>
        <p className="text-muted-foreground">Səhifədə görünən bütün məzmunu buradan redaktə edin.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Səhifə Məzmunu</CardTitle>
          <CardDescription>
            Aşağıdakı məzmun birbaşa ŞEC-in "Haqqımızda" səhifəsində göstəriləcək.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
          ) : (
            <SecAboutContentForm
              onSubmit={handleFormSubmit}
              initialData={content}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
