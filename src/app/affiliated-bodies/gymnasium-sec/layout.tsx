import type { Metadata } from 'next';
import '@/app/globals.css';

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
  return <>{children}</>;
}
