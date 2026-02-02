import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | NDU Gimnaziya ŞEC',
    default: 'NDU Gimnaziya Şagird Elmi Cəmiyyəti',
  },
  description: 'Naxçıvan Dövlət Universiteti nəzdində fəaliyyət göstərən Gimnaziyanın Şagird Elmi Cəmiyyətinin (ŞEC) rəsmi bölməsi.',
  robots: {
    index: true,
    follow: true,
  }
};


export default function SecLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
