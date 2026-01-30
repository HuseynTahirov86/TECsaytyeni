import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Əlaqə',
  description: 'Şagird Elmi Cəmiyyəti ilə əlaqə saxlayın.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          Bizimlə Əlaqə
        </h1>
         <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Suallarınız və ya təklifləriniz üçün bizə müraciət edin.
        </p>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>Əlaqə Məlumatları</CardTitle>
            <CardDescription>Aşağıdakı vasitələrlə bizimlə əlaqə saxlaya bilərsiniz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                    <MapPin className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Ünvan</h3>
                    <p className="text-muted-foreground">
                     Naxçıvan şəhəri, Heydər Əliyev prospekti, NDU nəzdində Gimnaziya.
                    </p>
                </div>
            </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                    <Mail className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <a href="mailto:sec@ndu.edu.az" className="text-muted-foreground hover:text-primary transition-colors">sec@ndu.edu.az (nümunə)</a>
                </div>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
