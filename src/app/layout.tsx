import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MainSidebar from '@/components/layout/main-sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'AzerNews Hub',
  description: 'Müasir və funksional bir internet portalı',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background')}>
        <SidebarProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
              <MainSidebar />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Footer />
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
