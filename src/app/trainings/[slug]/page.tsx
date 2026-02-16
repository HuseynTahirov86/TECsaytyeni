
"use client";

import { useState, useEffect } from 'react';
import * as React from 'react';
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Training, type QuizQuestion } from "@/app/ndutecnaxcivan19692025tec/trainings/training-form";
import { TrainingRegistrationButton } from './training-registration';
import { Calendar, Award, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrainingContent } from './training-content';
import { useSession } from '@/hooks/use-session';
import { getUserById } from '@/lib/data';
import type { User } from '@/lib/definitions';
import { CertificateGenerator } from './certificate-generator';
import type { TrainingRegistration } from '@/lib/data';
import type { Metadata } from 'next';
import Image from 'next/image';


const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    date.setUTCHours(0, 0, 0, 0);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    };
    return new Intl.DateTimeFormat('az-AZ', options).format(date);
};

async function getTraining(slug: string): Promise<Training | null> {
    const q = query(collection(db, "trainings"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
        quiz: data.quiz as QuizQuestion[] || [],
    } as Training;
}

async function getRegistrationStatus(trainingId: string, userId: string): Promise<TrainingRegistration | null> {
    const q = query(
        collection(db, "trainingRegistrations"),
        where("trainingId", "==", trainingId),
        where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
        id: doc.id,
        ...doc.data(),
    } as TrainingRegistration;
}

// Although this is a client component, we can't export metadata directly.
// This needs to be handled in a parent server component or layout if dynamic metadata is needed.
// For now, a generic title will be used from layout.

export default function TrainingDetailPage({ params }: { params: { slug: string } }) {
  const [training, setTraining] = useState<Training | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [registration, setRegistration] = useState<TrainingRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session, loading } = useSession();
  const [isClient, setIsClient] = useState(false);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
        const fetchedTraining = await getTraining(params.slug);
        setTraining(fetchedTraining);

        if (session?.user?.id) {
            const fetchedUser = await getUserById(session.user.id);
            setUser(fetchedUser || null);

            if (fetchedTraining && fetchedUser) {
                const regStatus = await getRegistrationStatus(fetchedTraining.id, fetchedUser.id);
                setRegistration(regStatus);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    if (!loading) {
       fetchInitialData();
    }

  }, [params.slug, session, loading]);
  
  
  const handleRegistrationSuccess = async () => {
    // Re-fetch registration status after success
     if (training && user) {
        const regStatus = await getRegistrationStatus(training.id, user.id);
        setRegistration(regStatus);
    }
  };

  if (isLoading || loading) {
      return (
          <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="w-full h-96 rounded-lg" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="w-full h-96 rounded-lg" />
                </div>
            </div>
        </div>
      )
  }

  if (!training) {
     return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Təlim Tapılmadı</h1>
        <p className="text-muted-foreground mt-2">Axtardığınız təlim mövcud deyil və ya silinib.</p>
      </div>
    );
  }

   if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Giriş Tələb Olunur</h1>
        <p className="text-muted-foreground mt-2">Bu təlimi görmək üçün zəhmət olmasa, hesabınıza daxil olun.</p>
      </div>
    );
  }

  const isRegistered = registration !== null;
  const isCompleted = registration?.status === 'tamamlandı';


  return (
     <div className="bg-muted">
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-12">
                {/* Training Details */}
                <div className="lg:col-span-2 space-y-6">
                     {training.imageUrl && (
                        <div className="mb-8 rounded-lg overflow-hidden shadow-lg relative aspect-video">
                            <Image
                                src={training.imageUrl}
                                alt={training.title}
                                fill
                                className="object-cover"
                                data-ai-hint={training.imageHint}
                            />
                        </div>
                    )}
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary leading-tight">
                        {training.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-md text-muted-foreground">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-5 w-5 text-accent" />
                           <span className="font-semibold">
                              {isClient ? formatDate(training.date) : '...'}
                           </span>
                        </div>
                        {training.hasCertificate && (
                           <Badge variant="default" className="text-base">
                               <Award className="h-5 w-5 mr-2" />
                               Sertifikatlı
                           </Badge>
                        )}
                    </div>
                    
                    {training.content && (
                         <div 
                            className="prose prose-lg max-w-none text-foreground/90 pt-6 border-t"
                            dangerouslySetInnerHTML={{ __html: training.content }}
                        />
                    )}
                    
                    {isRegistered && <TrainingContent training={training} registration={registration} user={user} onComplete={handleRegistrationSuccess} />}
                </div>

                 {/* Registration Form or Status */}
                <div className="lg:col-span-1">
                    <div className="p-8 border rounded-lg bg-card text-card-foreground shadow-lg self-start sticky top-24">
                        <h2 className="text-2xl font-bold mb-2">
                            {isRegistered ? (isCompleted ? 'Təlim Tamamlanıb' : 'Qeydiyyatdan Keçmisiniz') : 'Qeydiyyatdan Keçin'}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {isRegistered 
                                ? (isCompleted ? 'Təbriklər, siz bu təlimi tamamlamısınız! Nəticələriniz və sertifikatınız (əgər varsa) aşağıda göstərilib.' : 'Siz bu təlimə artıq qeydiyyatdan keçmisiniz. Təlim materialları solda göstərilib.') 
                                : 'Bu təlimin tam məzmununa (modullar, testlər) giriş əldə etmək üçün aşağıdakı düyməyə klikləyin.'
                            }
                        </p>
                        {!isRegistered && (
                            <TrainingRegistrationButton
                                trainingId={training.id} 
                                trainingTitle={training.title}
                                trainingSlug={training.slug}
                                userId={user.id}
                                onSuccess={handleRegistrationSuccess}
                            />
                        )}
                         {isRegistered && isCompleted && training.hasCertificate && registration.certificateId && (
                             <div className="mt-6 pt-6 border-t">
                                 <CertificateGenerator 
                                    trainingTitle={training.title} 
                                    userName={user.name} 
                                    certificateId={registration.certificateId}
                                />
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
     </div>
  );
}
