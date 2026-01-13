
import type { Metadata } from 'next';
import { TrainingLoginForm } from './login-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Giriş',
    description: 'NDU TEC hesabınıza daxil olaraq təlimlərə qatılın və fəaliyyətlərdən xəbərdar olun.',
};

function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle>Hesaba Giriş</CardTitle>
            <CardDescription>Şəxsi kabinetinizə daxil olun.</CardDescription>
            </CardHeader>
            <CardContent>
            <TrainingLoginForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Hesabınız yoxdur?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                Qeydiyyatdan keçin
                </Link>
            </p>
            </CardContent>
        </Card>
        </div>
    )
}


export default function TrainingLoginPage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <LoginPage />
    </Suspense>
  )
}
