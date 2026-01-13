"use client";

import { useActionState, Suspense } from "react";
import { verifyCertificate } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, ShieldX, Hourglass, CheckCircle } from "lucide-react";
import type { CertificateVerificationResult } from "@/lib/actions";
import { useRouter } from 'next/navigation';

const initialState: CertificateVerificationResult = { status: 'idle' };

function VerifyContent() {
  const [state, formAction] = useActionState(verifyCertificate, initialState);
  const router = useRouter();

  const handleViewCertificate = () => {
    if (state.status === 'success' && state.data) {
        const params = new URLSearchParams({ id: state.data.certificateId });
        router.push(`/certificate?${params.toString()}`);
    }
  };

  const renderResult = () => {
    switch (state.status) {
      case 'loading':
        return (
          <div className="flex items-center justify-center p-6 text-muted-foreground">
            <Hourglass className="mr-2 h-5 w-5 animate-spin" />
            <span>Yoxlanılır...</span>
          </div>
        );
      case 'success':
         return (
           <div className="p-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg space-y-4">
             <div className="flex items-center text-green-700 dark:text-green-300">
                <CheckCircle className="mr-3 h-8 w-8" />
                <h3 className="text-xl font-bold">Sertifikat Təsdiqləndi</h3>
             </div>
             <div className="text-sm text-foreground/80 space-y-1">
                <p><strong>Sertifikat ID:</strong> {state.data?.certificateId}</p>
                <p><strong>Təltif olunan:</strong> {state.data?.fullName}</p>
                <p><strong>Təlimin adı:</strong> {state.data?.trainingTitle}</p>
                <p><strong>Verilmə tarixi:</strong> {state.data?.issueDate}</p>
             </div>
             <Button onClick={handleViewCertificate}>Sertifikata Bax</Button>
          </div>
        );
      case 'not_found':
        return (
           <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
             <div className="flex items-center text-yellow-700 dark:text-yellow-300">
                <ShieldX className="mr-3 h-8 w-8" />
                <h3 className="text-xl font-bold">Sertifikat Tapılmadı</h3>
             </div>
             <p className="mt-2 text-sm text-foreground/80">
                Daxil etdiyiniz kodla heç bir sertifikat tapılmadı. Zəhmət olmasa, kodu yoxlayıb yenidən cəhd edin.
             </p>
          </div>
        );
      case 'error':
        return (
           <div className="p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
             <div className="flex items-center text-red-700 dark:red-yellow-300">
                <ShieldX className="mr-3 h-8 w-8" />
                <h3 className="text-xl font-bold">Xəta</h3>
             </div>
             <p className="mt-2 text-sm text-foreground/80">{state.message}</p>
          </div>
        );
      case 'idle':
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
            Sertifikat Yoxlama
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Sertifikatın etibarlılığını yoxlamaq üçün unikal identifikator kodunu daxil edin.
            </p>
        </header>

        <Card>
            <CardContent className="pt-6">
            <form action={formAction} className="space-y-4">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="certificateId"
                    name="certificateId"
                    type="text"
                    placeholder="Sertifikat kodunu daxil edin..."
                    required
                    className="pl-10 h-12 text-lg"
                />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={state.status === 'loading'}>
                <ShieldCheck className="mr-2 h-5 w-5"/> Yoxla
                </Button>
            </form>
            
            <div className="mt-6">
                {renderResult()}
            </div>
            </CardContent>
        </Card>
        </div>
  );
}


export default function VerifyClientPage() {
    return (
        <Suspense fallback={<div>Yüklənir...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
