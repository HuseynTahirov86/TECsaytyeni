
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface CertificateGeneratorProps {
  trainingTitle: string;
  userName: string;
  certificateId: string;
}

export function CertificateGenerator({ trainingTitle, userName, certificateId }: CertificateGeneratorProps) {
  const router = useRouter();

  const handleGenerate = () => {
    const params = new URLSearchParams({
      name: userName,
      training: trainingTitle,
      id: certificateId,
    });
    router.push(`/certificate?${params.toString()}`);
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader>
        <CardTitle className="text-center">Sertifikatınız Hazırdır!</CardTitle>
         <CardDescription className="text-center">Sertifikat ID: {certificateId}</CardDescription>
      </CardHeader>
        <CardContent className="pt-0">
            <div className="space-y-4 text-center">
                <p className="text-muted-foreground">
                    Təlimi uğurla tamamladığınız üçün təşəkkür edirik. Sertifikatınızı görmək və ya yükləmək üçün aşağıdakı düyməyə klikləyin.
                </p>
                 <Button onClick={handleGenerate} size="lg">
                    <Award className="mr-2 h-5 w-5" />
                    Sertifikata Bax / Yüklə
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
