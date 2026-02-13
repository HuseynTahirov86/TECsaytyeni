import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AboutContent } from '@/app/ndutecnaxcivan19692025tec/about-content/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vizyonumuz',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin vizyonu.',
};

async function getAboutContent(): Promise<AboutContent | null> {
    const docRef = doc(db, "siteContent", "about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AboutContent;
    }
    return null;
}

export default async function VisionPage() {
    const aboutContent = await getAboutContent();

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Vizyonumuz
                </h1>
            </header>

            {aboutContent?.visionContent ? (
                <section>
                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader className="flex flex-col items-center text-center">
                        <div className="bg-primary-foreground/20 p-4 rounded-full mb-4">
                            <Eye className="h-10 w-10 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-3xl">Vizyonumuz</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                            <p>{aboutContent.visionContent}</p>
                        </CardContent>
                    </Card>
                </section>
            ) : (
                 <div className="text-center py-16 text-muted-foreground">
                    <p>Vizyon haqqında məlumat tapılmadı.</p>
                </div>
            )}
        </div>
    );
}
