
import type { Metadata } from 'next';
import { TetiRegisterForm } from './register-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'TETİ Qeydiyyat',
    description: 'TETİ şəxsi kabineti üçün yeni hesab yaradın.',
     robots: {
        index: false,
        follow: false,
    }
};

export default function TetiRegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>TETİ Şəxsi Kabineti üçün Qeydiyyat</CardTitle>
          <CardDescription>Elmi tədqiqat işinizi idarə etmək üçün hesab yaradın.</CardDescription>
        </CardHeader>
        <CardContent>
          <TetiRegisterForm />
           <p className="mt-4 text-center text-sm text-muted-foreground">
            Artıq hesabınız var?{' '}
            <Link href="/teti-login" className="font-semibold text-primary hover:underline">
              Daxil olun
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
