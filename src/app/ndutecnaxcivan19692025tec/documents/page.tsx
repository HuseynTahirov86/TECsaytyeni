
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentsForm, type OfficialDocuments } from "./form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFile } from "@/lib/utils";

type FilesState = {
  charter: File | null;
  ethicsCode: File | null;
  researchRegulation: File | null;
}

export default function DocumentsAdminPage() {
  const [documents, setDocuments] = useState<OfficialDocuments | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const docPath = "siteContent";
  const docId = "documents";

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, docPath, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDocuments(docSnap.data() as OfficialDocuments);
        } else {
          setDocuments({ 
            charterUrl: "",
            ethicsCodeUrl: "",
            researchRegulationUrl: ""
          });
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
        toast({ title: "Xəta", description: "Sənədləri yükləyərkən problem yarandı.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  const handleFormSubmit = async (values: OfficialDocuments, files: FilesState) => {
    try {
      const urls = {
        charterUrl: values.charterUrl,
        ethicsCodeUrl: values.ethicsCodeUrl,
        researchRegulationUrl: values.researchRegulationUrl,
      };

      if (files.charter) {
        urls.charterUrl = await uploadFile(files.charter, 'sekiller');
      }
      if (files.ethicsCode) {
        urls.ethicsCodeUrl = await uploadFile(files.ethicsCode, 'sekiller');
      }
      if (files.researchRegulation) {
        urls.researchRegulationUrl = await uploadFile(files.researchRegulation, 'sekiller');
      }

      const docRef = doc(db, docPath, docId);
      await setDoc(docRef, urls, { merge: true });
      toast({ title: "Uğurlu", description: "Rəsmi sənədlər yeniləndi." });
      setDocuments(urls);
    } catch (error) {
      console.error("Error saving documents: ", error);
      toast({ title: "Xəta", description: "Məlumatları saxlayarkən problem yarandı.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rəsmi Sənədləri İdarə Et</h1>
        <p className="text-muted-foreground">Səhifələrdə görünən rəsmi sənədlərin fayllarını idarə edin.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sənəd Faylları</CardTitle>
          <CardDescription>
            "Haqqımızda/Sənədlər" səhifəsində göstərilən faylları buradan yükləyin və ya yeniləyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : (
            <DocumentsForm
              onSubmit={handleFormSubmit}
              initialData={documents}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
