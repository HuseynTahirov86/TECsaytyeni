
import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TeamMember } from '../ndutecnaxcivan19692025tec/team/team-form';
import type { FormerChairman } from '../ndutecnaxcivan19692025tec/formers/former-chairman-form';
import type { AboutContent } from '../ndutecnaxcivan19692025tec/about-content/form';
import AboutClientPage from './AboutClientPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Haqqımızda',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin tarixi, məqsədləri, fəaliyyət istiqamətləri və komandası haqqında ətraflı məlumat.',
};

async function getTeamMembers(): Promise<TeamMember[]> {
    const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }) as TeamMember);
}

async function getFormerChairmen(): Promise<FormerChairman[]> {
    const q = query(collection(db, "formerChairmen"), orderBy("period", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }) as FormerChairman);
}

async function getAboutContent(): Promise<AboutContent | null> {
    const docRef = doc(db, "siteContent", "about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AboutContent;
    }
    return null;
}

export default async function AboutPage() {
    const teamMembers = await getTeamMembers();
    const formerChairmen = await getFormerChairmen();
    const aboutContent = await getAboutContent();

    return <AboutClientPage teamMembers={teamMembers} formerChairmen={formerChairmen} aboutContent={aboutContent} />;
}
