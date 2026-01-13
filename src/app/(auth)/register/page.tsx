import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import UserAuthForm from '@/components/user-auth-form';

export default function RegisterPage() {
  return (
    <>
      <div className="flex flex-col items-center text-center">
        <Newspaper className="h-12 w-12 text-primary-foreground" style={{backgroundColor: 'hsl(var(--primary))', padding: '8px', borderRadius: '8px' }}/>
        <h2 className="mt-6 text-3xl font-bold tracking-tight font-headline">
          Yeni hesab yaradın
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Artıq hesabınız var?{' '}
          <Link href="/login" className="font-medium text-accent hover:text-accent/90">
            Daxil olun
          </Link>
        </p>
      </div>
      <UserAuthForm mode="register" />
    </>
  );
}
