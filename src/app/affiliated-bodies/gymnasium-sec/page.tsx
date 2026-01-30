import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Note: Metadata from layout is used, this is for page-specific overrides if needed.
export const metadata: Metadata = {
  title: 'Ana Səhifə',
  description: 'Naxçıvan Dövlət Universiteti nəzdində Gimnaziyanın Şagird Elmi Cəmiyyətinin (ŞEC) rəsmi ana səhifəsi.',
};

export default function GymnasiumSECPage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('/tecson2.png')"}}></div>
        <div className="relative z-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-6xl">
            NDU Gimnaziya Şagird Elmi Cəmiyyəti
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Gənc tədqiqatçıların elmə atdığı ilk addımlar.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/affiliated-bodies/gymnasium-sec/about">
                        Daha Çox Öyrən <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/affiliated-bodies/gymnasium-sec/projects">Layihələrimiz</Link>
                </Button>
            </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold">Xoş Gəlmisiniz!</h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
                Bu bölmə NDU nəzdində fəaliyyət göstərən Gimnaziyanın Şagird Elmi Cəmiyyətinə həsr olunmuşdur. Burada ŞEC-in fəaliyyəti, layihələri və gənc istedadların əldə etdiyi nailiyyətlər haqqında məlumat tapa bilərsiniz.
            </p>
        </div>
      </section>
    </div>
  );
}
