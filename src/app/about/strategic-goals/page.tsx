import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AboutContent } from '@/app/ndutecnaxcivan19692025tec/about-content/form';
import { AboutContentClient } from '../AboutContentClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Strateji Məqsədlərimiz',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin strateji məqsədləri.',
};

async function getAboutContent(): Promise<AboutContent | null> {
    const docRef = doc(db, "siteContent", "about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AboutContent;
    }
    return null;
}

export default async function StrategicGoalsPage() {
    const aboutContent = await getAboutContent();

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Strateji Məqsədlərimiz
                </h1>
            </header>
            
            {aboutContent?.goalsContent && (
                 <section>
                    <AboutContentClient content={aboutContent.goalsContent} />
                </section>
            )}
        </div>
    );
}
