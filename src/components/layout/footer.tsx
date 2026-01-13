import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Newspaper, Twitter, Facebook, Instagram } from 'lucide-react';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        {children}
    </Link>
);

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
             <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
                <Newspaper className="h-6 w-6 text-primary-foreground" style={{backgroundColor: 'hsl(var(--primary))', padding: '2px', borderRadius: '4px' }}/>
                AzerNews Hub
            </Link>
            <p className="text-muted-foreground text-sm">
              Azərbaycanın və dünyanın ən son xəbərləri.
            </p>
          </div>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div className="grid gap-2">
              <h3 className="font-semibold">Naviqasiya</h3>
              <FooterLink href="/about">Haqqımızda</FooterLink>
              <FooterLink href="/contact">Əlaqə</FooterLink>
              <FooterLink href="/policies">Siyasətlər</FooterLink>
            </div>
            <div className="grid gap-2">
              <h3 className="font-semibold">Kateqoriyalar</h3>
              <FooterLink href="/category/technology">Texnologiya</FooterLink>
              <FooterLink href="/category/sports">İdman</FooterLink>
              <FooterLink href="/category/politics">Siyasət</FooterLink>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Bizi izləyin</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Facebook className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Instagram className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AzerNews Hub. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
}
