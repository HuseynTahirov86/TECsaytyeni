
"use client";

import { useEffect, useState } from "react";
import { getCertificates } from "@/lib/data";
import type { TrainingRegistration } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const formatDate = (date: Date | undefined) => {
    if (!date) return 'Bilinmir';
    if (isNaN(date.getTime())) return 'Bilinmir';
    
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    };
    return new Intl.DateTimeFormat('az-AZ', options).format(date);
};


export function MyCertificates({ userId }: { userId: string }) {
    const [certificates, setCertificates] = useState<TrainingRegistration[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCerts() {
            setIsLoading(true);
            const data = await getCertificates(userId);
            setCertificates(data);
            setIsLoading(false);
        }

        fetchCerts();
    }, [userId]);
    
    const generateCertificateLink = (cert: TrainingRegistration) => {
        const params = new URLSearchParams({
            name: cert.fullName,
            training: cert.trainingTitle,
            id: cert.certificateId || '',
        });
        return `/certificate?${params.toString()}`;
    }

    if (isLoading) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sertifikatlarım</CardTitle>
                <CardDescription>Burada uğurla qazandığınız bütün sertifikatlar göstərilir.</CardDescription>
            </CardHeader>
            <CardContent>
                {certificates.length > 0 ? (
                    <ul className="space-y-4">
                        {certificates.map(cert => (
                            <li key={cert.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                               <div className="flex items-start gap-4">
                                 <Award className="h-8 w-8 text-yellow-500 mt-1 shrink-0" />
                                 <div>
                                     <h3 className="font-semibold text-lg">{cert.trainingTitle}</h3>
                                     <p className="text-sm text-muted-foreground mt-1">
                                        ID: {cert.certificateId}
                                     </p>
                                      <p className="text-sm text-muted-foreground">
                                        Verilmə tarixi: {formatDate(cert.completionDate?.toDate())}
                                     </p>
                                 </div>
                               </div>
                               <Button asChild className="w-full sm:w-auto shrink-0">
                                   <Link href={generateCertificateLink(cert)} target="_blank">
                                        <Download className="mr-2 h-4 w-4" />
                                        Sertifikata Bax / Yüklə
                                   </Link>
                               </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        <Award className="h-10 w-10 mb-2"/>
                        <h3 className="text-xl font-semibold">Sertifikat Tapılmadı</h3>
                        <p>Bir təlimi tamamlayıb sertifikat qazandıqdan sonra sənədiniz burada görünəcək.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
