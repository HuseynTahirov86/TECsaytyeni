import type { Metadata } from 'next';
import { Livvic } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster";

const livvic = Livvic({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: "--font-livvic",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tec.ndu.edu.az'),
  title: {
    template: '%s | NDU TEC',
    default: 'NDU TEC | Tələbə Elmi Cəmiyyəti',
  },
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin (TEC) rəsmi veb-saytı. Layihələr, tədbirlər, xəbərlər və elmi jurnallar.',
  openGraph: {
    title: {
       template: '%s | NDU TEC',
       default: 'NDU TEC | Tələbə Elmi Cəmiyyəti',
    },
    description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin (TEC) rəsmi veb-saytı. Layihələr, tədbirlər, xəbərlər və elmi jurnallar.',
    url: 'https://tec.ndu.edu.az',
    siteName: 'NDU TEC',
    images: [
      {
        url: '/tecson2.png', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
       template: '%s | NDU TEC',
       default: 'NDU TEC rəsmi saytı. Layihələr, tədbirlər və xəbərləri kəşf edin.',
    },
    description: 'NDU TEC rəsmi saytı. Layihələr, tədbirlər və xəbərləri kəşf edin.',
    images: ['/tecson2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NDU Tələbə Elmi Cəmiyyəti",
    "alternateName": "NDU TEC",
    "url": "https://tec.ndu.edu.az",
    "logo": "https://tec.ndu.edu.az/logo1.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+994-36-544-08-61",
      "contactType": "customer service",
      "areaServed": "AZ",
      "availableLanguage": "Azerbaijani"
    },
    "sameAs": [
      "https://www.facebook.com/ndutecc",
      "https://www.instagram.com/ndu.tec"
    ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
      </head>
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