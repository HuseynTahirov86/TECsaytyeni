
import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecTeamMember } from '@/app/ndutecnaxcivan19692025tec/sec-team/form';
import type { AboutContent } from '@/app/ndutecnaxcivan19692025tec/about-content/form';
import SecAboutClientPage from './SecAboutClientPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ŞEC Haqqında',
  description: 'NDU nəzdində Gimnaziyanın Şagird Elmi Cəmiyyəti (ŞEC) haqqında ətraflı məlumat.',
};

async function getSecTeamMembers(): Promise<SecTeamMember[]> {
    const q = query(collection(db, "secTeamMembers"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }) as SecTeamMember);
}

async function getSecAboutContent(): Promise<AboutContent | null> {
    const docRef = doc(db, "siteContent", "sec-about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AboutContent;
    }
    return null;
}

export default async function SecAboutPage() {
    const teamMembers = await getSecTeamMembers();
    const aboutContent = await getSecAboutContent();

    return <SecAboutClientPage teamMembers={teamMembers} aboutContent={aboutContent} />;
}
