import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sənədlər',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin rəsmi sənədləri: əsasnamə və etik davranış kodeksi.',
};

export default function DocumentsPage() {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                    Sənədlər
                </h1>
                 <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Təşkilatımızın fəaliyyətini tənzimləyən əsas sənədlər.
                </p>
            </header>
             <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                  <a href="/tecesasname.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" />
                      TEC Əsasnaməsi
                  </a>
              </Button>
                <Button asChild size="lg" variant="secondary">
                  <a href="/tecetikcodex.docx" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Download className="mr-2 h-5 w-5" />
                      Etik Davranış Kodeksi
                  </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                    <a href="/alitehsilesas.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-center">
                      <Download className="mr-2 h-5 w-5 flex-shrink-0" />
                      <span className="whitespace-normal leading-tight text-center">Təhsilalanların Elmi Tədqiqat İşi Haqqında Əsasnamə</span>
                  </a>
              </Button>
          </div>
        </div>
    );
}
