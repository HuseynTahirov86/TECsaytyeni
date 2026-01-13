'use client';

import React, { useEffect, useState, useActionState, useRef } from 'react';
import { useSession } from '@/hooks/use-session';
import { logout } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TetiUser } from '@/lib/definitions';
import { getTetiUserById } from '@/lib/data';
import { LogOut, User, BookUser, Book, Edit, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { addTetiTopic } from '@/lib/actions';
import { redirect } from 'next/navigation';

function AddTopicButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? 'Əlavə edilir...' : <><PlusCircle className="mr-2 h-4 w-4" /> Mövzu Əlavə Et</>}
    </Button>
  );
}

export default function TetiAccountPage() {
  const { session, loading: sessionLoading } = useSession();
  const [user, setUser] = useState<TetiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const topicFormRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(addTetiTopic, { message: null, success: false });
  
  const fetchUserData = async (userId: string) => {
    const fetchedUser = await getTetiUserById(userId);
    if (fetchedUser) {
      setUser(fetchedUser);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    if (!sessionLoading) {
      if (!session?.user || session.user.userType !== 'teti') {
        redirect('/teti-login');
      } else {
        fetchUserData(session.user.id);
      }
    }
  }, [session, sessionLoading]);

  
  // Refetch user data after successful topic submission
  useEffect(() => {
    if(state.success && session?.user?.id) {
        fetchUserData(session.user.id);
        if(topicFormRef.current) {
            topicFormRef.current.reset();
        }
    }
  }, [state.success, session]);


  if (sessionLoading || loading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-3">
                <aside className="md:col-span-1 space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                </aside>
                <main className="md:col-span-2">
                    <Skeleton className="h-96 w-full" />
                </main>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-5rem)]">
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-3">
                <aside className="md:col-span-1 space-y-6 self-start sticky top-24">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarFallback> <User className="h-12 w-12"/> </AvatarFallback>
                            </Avatar>
                            <CardTitle>{user.fullName}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <Separator className="my-4"/>
                            <div className="space-y-2">
                                <p><strong>Fakültə:</strong> {user.faculty}</p>
                                <p><strong>İxtisas:</strong> {user.specialization}</p>
                                <p><strong>Tədris dili:</strong> {user.studyLanguage}</p>
                                <p><strong>Telefon:</strong> {user.phone}</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Elmi Rəhbərlər</CardTitle>
                        </CardHeader>
                         <CardContent>
                             <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {user.advisors.map((advisor, i) => <li key={i}>{advisor}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                    <form action={logout}>
                        <Button variant="ghost" type="submit" className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600">
                            <LogOut className="mr-2 h-4 w-4" /> Çıxış
                        </Button>
                    </form>
                </aside>
                <main className="md:col-span-2">
                   <Card>
                        <CardHeader>
                            <CardTitle>Elmi Tədqiqat İşlərim</CardTitle>
                            <CardDescription>Burada tədqiqat mövzularınızı idarə edə bilərsiniz.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.topics && user.topics.length > 0 ? (
                                <ul className="space-y-3">
                                    {user.topics.map((topic, index) => (
                                        <li key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                                            <Book className="h-5 w-5 text-primary"/>
                                            <span className="font-medium">{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                 <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                    <BookUser className="h-8 w-8 mb-2"/>
                                    <h3 className="text-lg font-semibold">Heç bir mövzu əlavə edilməyib</h3>
                                </div>
                            )}
                            <Separator className="my-6"/>
                             <form ref={topicFormRef} action={formAction} className="space-y-4">
                                <h3 className="font-semibold">Yeni Mövzu Əlavə Et</h3>
                                <Input name="userId" type="hidden" value={user.id} />
                                <Input name="topic" placeholder="Yeni tədqiqat mövzusunun adı" required/>
                                <AddTopicButton />
                                {state?.message && (
                                     <Alert variant={state.success ? "default" : "destructive"} className={state.success ? "bg-green-50 border-green-200" : ""}>
                                        <Terminal className="h-4 w-4" />
                                        <AlertTitle>{state.success ? "Uğurlu" : "Xəta"}</AlertTitle>
                                        <AlertDescription>{state.message}</AlertDescription>
                                    </Alert>
                                )}
                            </form>
                        </CardContent>
                   </Card>
                </main>
            </div>
        </div>
    </div>
  );
}
