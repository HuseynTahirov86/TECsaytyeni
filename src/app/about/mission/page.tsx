import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AboutContent } from '@/app/ndutecnaxcivan19692025tec/about-content/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { AboutContentClient } from '../AboutContentClient';


export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Missiya və Dəyərlər',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin vizyonu, missiyası, dəyərləri və strateji məqsədləri.',
};

async function getAboutContent(): Promise<AboutContent | null> {
    const docRef = doc(db, "siteContent", "about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AboutContent;
    }
    return null;
}

export default async function MissionPage() {
    const aboutContent = await getAboutContent();

    return (
        <div className="space-y-16">
            <header>
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Missiya və Dəyərlər
                </h1>
            </header>

            {aboutContent?.visionContent && (
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
            )}

            {aboutContent?.missionContent && (
                 <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-primary">Əsas Fəaliyyət İstiqamətlərimiz</h2>
                    </div>
                    <AboutContentClient content={aboutContent.missionContent} />
                </section>
            )}

            {aboutContent?.valuesContent && (
                 <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-primary">Dəyər və Prinsiplərimiz</h2>
                    </div>
                    <AboutContentClient content={aboutContent.valuesContent} />
                </section>
            )}

            {aboutContent?.goalsContent && (
                 <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-primary">Strateji Məqsədlərimiz</h2>
                    </div>
                    <AboutContentClient content={aboutContent.goalsContent} />
                </section>
            )}
        </div>
    );
}
