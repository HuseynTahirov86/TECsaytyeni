
"use client";

import { Suspense, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookCheck, Award, ShieldCheck, User, LogOut } from "lucide-react";
import { TrainingsClientPage } from './trainings-client-page';
import { useSession } from '@/hooks/use-session';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CompletedTrainings } from './completed-trainings';
import { MyCertificates } from './my-certificates';

type ViewType = 'all' | 'completed' | 'certificates' | 'verify';

function TrainingsDashboardContent() {
    const [view, setView] = useState<ViewType>('all');
    const { session, loading } = useSession();

    useEffect(() => {
        if (!loading && (!session?.user || session.user.userType !== 'user')) {
            redirect('/training-login');
        }
    }, [loading, session]);


    if (loading || !session?.user) {
         return (
             <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <Skeleton className="w-full h-64" />
                    </aside>
                    <main className="md:col-span-3">
                        <Skeleton className="w-full h-96" />
                    </main>
                </div>
            </div>
        )
    }
    
    const user = session.user;

    const renderView = () => {
        switch (view) {
            case 'all':
                return <TrainingsClientPage />;
            case 'completed':
                return <CompletedTrainings userId={user.id} />;
            case 'certificates':
                return <MyCertificates userId={user.id} />;
             case 'verify':
                return (
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sertifikat Yoxla</CardTitle>
                                <CardDescription>
                                    Başqa birinin sertifikatının həqiqiliyini yoxlamaq üçün onun unikal kodunu aşağıya daxil edin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href="/verify">
                                        Yoxlama Səhifəsinə Keç
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )
            default:
                return <TrainingsClientPage />;
        }
    };
    
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
            <aside className="md:col-span-1 self-start sticky top-24">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                           <Avatar className="h-12 w-12">
                                <AvatarFallback><User className="h-6 w-6"/></AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl">{user.name}</CardTitle>
                                <CardDescription>Təlim Paneli</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button variant={view === 'all' ? 'default' : 'ghost'} onClick={() => setView('all')} className="justify-start">
                            <GraduationCap className="mr-2 h-4 w-4" /> Bütün Təlimlər
                        </Button>
                        <Button variant={view === 'completed' ? 'default' : 'ghost'} onClick={() => setView('completed')} className="justify-start">
                            <BookCheck className="mr-2 h-4 w-4" /> Tamamladıqlarım
                        </Button>
                        <Button variant={view === 'certificates' ? 'default' : 'ghost'} onClick={() => setView('certificates')} className="justify-start">
                            <Award className="mr-2 h-4 w-4" /> Sertifikatlarım
                        </Button>
                        <Button variant={view === 'verify' ? 'default' : 'ghost'} onClick={() => setView('verify')} className="justify-start">
                            <ShieldCheck className="mr-2 h-4 w-4" /> Sertifikat Yoxla
                        </Button>
                         <form action={logout} className="w-full mt-4 pt-4 border-t">
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" /> Çıxış
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </aside>
            <main className="md:col-span-3">
                {renderView()}
            </main>
        </div>
    </div>
  )
}


export default function TrainingsDashboard() {
    return (
        <Suspense fallback={<div>Yüklənir...</div>}>
            <TrainingsDashboardContent />
        </Suspense>
    );
}
