
import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecTeamMember } from '@/app/ndutecnaxcivan19692025tec/sec-team/form';
import AboutClientPage from './AboutClientPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Haqqımızda',
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


export default async function AboutPage() {
    const teamMembers = await getSecTeamMembers();

    return <AboutClientPage teamMembers={teamMembers} />;
}
