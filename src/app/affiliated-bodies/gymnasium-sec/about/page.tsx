import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users2, CheckCircle, Goal, ListOrdered, Handshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Haqqımızda',
  description: 'NDU nəzdində Gimnaziyanın Şagird Elmi Cəmiyyəti (ŞEC) haqqında ətraflı məlumat.',
};

export default function AboutPage() {
    const mainDirections = [
      {
        title: "Elmi Tədqiqat",
        description: "Şagirdləri maraqlandıqları sahələrdə kiçik həcmli elmi araşdırmalar aparmağa təşviq etmək.",
        icon: GraduationCap,
      },
      {
        title: "Konfrans və Seminarlar",
        description: "Şagirdlərin öz tədqiqatlarını təqdim edə biləcəyi məktəbdaxili konfrans və seminarlar təşkil etmək.",
        icon: Users2,
      },
       {
        title: "Elmi Populyarlıq",
        description: "Elmin maraqlı və əyləncəli tərəflərini təqdimatlar, təcrübələr və viktorinalar vasitəsilə tanıtmaq.",
        icon: CheckCircle,
      },
       {
        title: "Layihə Müsabiqələri",
        description: "Məktəblilər arasında kiçik elmi layihə müsabiqələri keçirərək yaradıcılığı stimullaşdırmaq.",
        icon: Goal,
      },
    ];


  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          ŞEC Haqqında
        </h1>
         <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Gələcəyin alimlərinin yetişdiyi məkan.
        </p>
      </header>
       <div className="my-12">
        <Image
          src="https://picsum.photos/seed/gymnasium-team/1200/500"
          alt="ŞEC Komandası"
          width={1200}
          height={500}
          className="rounded-lg shadow-lg object-cover w-full"
          data-ai-hint="group young students science project"
        />
      </div>
      <div className="prose prose-lg max-w-none mx-auto text-justify">
        <p>Naxçıvan Dövlət Universiteti nəzdindəki Gimnaziyanın Şagird Elmi Cəmiyyəti (ŞEC), istedadlı və elmə marağı olan şagirdləri bir araya gətirərək onların elmi-tədqiqat bacarıqlarını erkən yaşlardan inkişaf etdirmək məqsədi daşıyır. Biz, şagirdlərin akademik potensialını reallaşdırmaq, onlara tədqiqat aparmağın əsaslarını öyrətmək və elmi düşüncə tərzini aşılamaq üçün çalışırıq.</p>
        <p>ŞEC olaraq, gənc nəslin elmə olan həvəsini artırmaq, onları gələcəyin alimləri, mühəndisləri və ixtiraçıları olmağa ruhlandırmaq əsas hədəfimizdir. Bu yolda müxtəlif layihələr, seminarlar, müsabiqələr və ekskursiyalar təşkil edərək onların həm nəzəri biliklərini, həm də praktiki bacarıqlarını gücləndiririk.</p>
      </div>

       <section className="mt-16">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Fəaliyyət İstiqamətlərimiz</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mainDirections.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    </div>
  );
}
