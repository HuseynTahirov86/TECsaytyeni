import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AboutContent } from '@/app/ndutecnaxcivan19692025tec/about-content/form';
import { AboutContentClient } from '../AboutContentClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Əsas Fəaliyyət İstiqamətlərimiz',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin əsas fəaliyyət istiqamətləri.',
};

async function getAboutContent(): Promise<AboutContent | null> {
    const docRef = doc(db, "siteContent", "about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AboutContent;
    }
    return null;
}

export default async function MainActivitiesPage() {
    const aboutContent = await getAboutContent();

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Əsas Fəaliyyət İstiqamətlərimiz
                </h1>
            </header>
            
            {aboutContent?.missionContent && (
                 <section>
                    <AboutContentClient content={aboutContent.missionContent} />
                </section>
            )}
        </div>
    );
}
