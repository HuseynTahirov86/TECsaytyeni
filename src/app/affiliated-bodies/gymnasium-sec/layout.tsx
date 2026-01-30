import type { Metadata } from 'next';
import { Livvic } from 'next/font/google';
import '@/app/globals.css';
import { cn } from "@/lib/utils";
import { Header } from './components/header';
import { Footer } from './components/footer';
import { Toaster } from "@/components/ui/toaster";

const livvic = Livvic({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: "--font-livvic",
});

export const metadata: Metadata = {
  title: {
    template: '%s | NDU Gimnaziya ŞEC',
    default: 'NDU Gimnaziya Şagird Elmi Cəmiyyəti',
  },
  description: 'Naxçıvan Dövlət Universiteti nəzdində fəaliyyət göstərən Gimnaziyanın Şagird Elmi Cəmiyyətinin (ŞEC) rəsmi bölməsi.',
  robots: { // Disallow indexing of the sub-site for now
    index: false,
    follow: false,
  }
};


export default function SecLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          livvic.variable
        )}>
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
