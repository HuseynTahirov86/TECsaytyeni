
import type { Metadata } from 'next';
import { RegisterForm } from './register-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Qeydiyyat',
    description: 'NDU TEC-in onlayn təlim və resurslarından faydalanmaq üçün yeni hesab yaradın.',
};

function RegisterPageContent() {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                <CardTitle>Hesab Yarat</CardTitle>
                <CardDescription>Təlimlərə qoşulmaq üçün yeni hesab yaradın.</CardDescription>
                </CardHeader>
                <CardContent>
                <RegisterForm />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Artıq hesabınız var?{' '}
                    <Link href="/training-login" className="font-semibold text-primary hover:underline">
                    Daxil olun
                    </Link>
                </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <RegisterPageContent />
    </Suspense>
  )
}
