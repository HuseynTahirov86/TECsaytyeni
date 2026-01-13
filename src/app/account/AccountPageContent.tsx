
"use client";

import { useSession } from '@/hooks/use-session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, GraduationCap, Briefcase, BookUser, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState, use } from 'react';
import type { User as UserType } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getUserById } from '@/lib/data';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions';

export default function AccountPageContent() {
    const { session, loading: sessionLoading } = useSession();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionLoading) {
            if (!session?.user || session.user.userType !== 'user') {
                redirect('/training-login');
            } else {
                setLoading(true);
                getUserById(session.user.id)
                    .then(fetchedUser => {
                        if (fetchedUser) {
                            setUser(fetchedUser);
                        } else {
                            logout();
                        }
                    })
                    .catch(error => {
                        console.error('User məlumatlarını almaqda xəta:', error);
                        logout();
                    })
                    .finally(() => setLoading(false));
            }
        }
    }, [sessionLoading, session]);
    
    if (sessionLoading || loading || !user) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="mb-6 flex justify-end">
                <form action={logout}>
                    <Button 
                        type="submit"
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Çıxış
                    </Button>
                </form>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <aside className="md:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={user.image || ''} alt={user.name}/>
                                <AvatarFallback>
                                    <User className="h-12 w-12"/>
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <Separator className="my-4"/>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2"/>
                                    <span>Təyinat: {user.designation}</span>
                                </div>
                                <div className="flex items-center">
                                    <GraduationCap className="h-4 w-4 mr-2"/>
                                    <span>İxtisas: {user.specialization} ({user.course}-ci kurs)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
                <main className="md:col-span-2">
                   <Card>
                        <CardHeader>
                            <CardTitle>Tamamlanmış Təlimlər</CardTitle>
                            <CardDescription>Burada tamamladığınız təlimlər və sertifikatlar göstərilir.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                <BookUser className="h-10 w-10 mb-2"/>
                                <h3 className="text-xl font-semibold">Heç bir təlim tamamlanmayıb</h3>
                                <p>Təlimləri tamamladıqca nəticələriniz burada görünəcək.</p>
                            </div>
                        </CardContent>
                   </Card>
                </main>
            </div>
        </div>
    );
}
