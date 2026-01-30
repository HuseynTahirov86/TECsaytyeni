import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Layihələr',
};

export default function ProjectsPage() {
  const isLoading = true; // Placeholder for future data fetching state

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          Layihələrimiz
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Şagirdlərimizin elmi yaradıcılığının məhsulu olan tədqiqat və ixtiralar.
        </p>
      </header>
       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
             <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground mt-8 p-8 border-dashed border-2 rounded-lg flex flex-col items-center">
                <Briefcase className="h-12 w-12 mb-4 text-muted-foreground"/>
                <h3 className="text-xl font-semibold">Layihələr Tezliklə Əlavə Olunacaq</h3>
                <p>Bu bölmə hazırlanma mərhələsindədir. Şagirdlərimizin layihələri tezliklə burada nümayiş etdiriləcək.</p>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
                 <Card key={i} className="flex flex-col invisible">
                    <CardHeader className="p-0">
                        <Skeleton className="w-full aspect-[3/2] rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            ))}
          </>
        ) : (
          <p>Projects will be listed here.</p>
        )}
      </div>
    </div>
  );
}
