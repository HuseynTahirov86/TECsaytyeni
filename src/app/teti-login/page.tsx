
import type { Metadata } from 'next';
import { TetiLoginForm } from './login-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'TETİ Giriş',
    description: 'TETİ Şəxsi Kabinetinizə daxil olun.',
    robots: {
        index: false,
        follow: false,
    }
};

function TetiLoginPageContent() {
  return (
     <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>TETİ Şəxsi Kabinetinə Giriş</CardTitle>
          <CardDescription>Elmi tədqiqat işlərinizi idarə etmək üçün daxil olun.</CardDescription>
        </CardHeader>
        <CardContent>
          <TetiLoginForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Hesabınız yoxdur?{' '}
            <Link href="/teti-register" className="font-semibold text-primary hover:underline">
              Qeydiyyatdan keçin
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TetiLoginPage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <TetiLoginPageContent />
    </Suspense>
  )
}
