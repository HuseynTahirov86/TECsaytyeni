import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecTeamMember } from '@/app/ndutecnaxcivan19692025tec/sec-team/form';
import type { SecAboutContent } from '@/app/ndutecnaxcivan19692025tec/sec-about-content/form';
import SecAboutClientPage from '../sec-about/SecAboutClientPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const aboutContent = await getSecAboutContent();

  const title = aboutContent?.title || 'Şagird Elmi Cəmiyyəti';
  const description = aboutContent?.mainContent
    ? aboutContent.mainContent.replace(/<[^>]*>?/gm, '').substring(0, 160)
    : 'NDU nəzdində Gimnaziyanın Şagird Elmi Cəmiyyəti (ŞEC) haqqında ətraflı məlumat: rəhbərlik, idarə heyəti və fəaliyyət istiqamətləri.';

  return {
    title,
    description,
    openGraph: {
        title: `${title} | NDU TEC`,
        description,
    },
    twitter: {
        title: `${title} | NDU TEC`,
        description,
    }
  };
}


async function getSecTeamMembers(): Promise<SecTeamMember[]> {
    const q = query(collection(db, "secTeamMembers"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }) as SecTeamMember);
}

async function getSecAboutContent(): Promise<SecAboutContent | null> {
    const docRef = doc(db, "siteContent", "sec-about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as SecAboutContent;
    }
    return null;
}

export default async function SecPage() {
    const teamMembers = await getSecTeamMembers();
    const aboutContent = await getSecAboutContent();

    return <SecAboutClientPage teamMembers={teamMembers} aboutContent={aboutContent} />;
}
