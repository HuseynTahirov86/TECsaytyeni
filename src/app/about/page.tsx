
import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TeamMember } from '../ndutecnaxcivan19692025tec/team/team-form';
import type { FormerChairman } from '../ndutecnaxcivan19692025tec/formers/former-chairman-form';
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

export default async function AboutPage() {
    const teamMembers = await getTeamMembers();
    const formerChairmen = await getFormerChairmen();

    return <AboutClientPage teamMembers={teamMembers} formerChairmen={formerChairmen} />;
}
