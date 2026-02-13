
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { OfficialDocuments } from '@/app/ndutecnaxcivan19692025tec/documents/form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sənədlər',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin rəsmi sənədləri: əsasnamə və etik davranış kodeksi.',
};

async function getDocuments(): Promise<OfficialDocuments | null> {
    const docRef = doc(db, "siteContent", "documents");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as OfficialDocuments;
    }
    return null;
}

export default async function DocumentsPage() {
    const documents = await getDocuments();

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
              {documents?.charterUrl && (
                  <Button asChild size="lg">
                      <a href={documents.charterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <Download className="mr-2 h-5 w-5" />
                          TEC Əsasnaməsi
                      </a>
                  </Button>
              )}
                {documents?.ethicsCodeUrl && (
                    <Button asChild size="lg" variant="secondary">
                      <a href={documents.ethicsCodeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <Download className="mr-2 h-5 w-5" />
                          Etik Davranış Kodeksi
                      </a>
                    </Button>
                )}
                {documents?.researchRegulationUrl && (
                    <Button asChild size="lg" variant="secondary">
                        <a href={documents.researchRegulationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-center">
                          <Download className="mr-2 h-5 w-5 flex-shrink-0" />
                          <span className="whitespace-normal leading-tight text-center">Təhsilalanların Elmi Tədqiqat İşi Haqqında Əsasnamə</span>
                      </a>
                    </Button>
                )}
                {!documents && (
                    <p className="text-muted-foreground">Yükləmək üçün heç bir sənəd tapılmadı.</p>
                )}
          </div>
        </div>
    );
}
