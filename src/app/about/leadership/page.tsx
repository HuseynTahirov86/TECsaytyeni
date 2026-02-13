import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TeamMember } from '@/app/ndutecnaxcivan19692025tec/team/team-form';
import type { Chairman } from '@/app/ndutecnaxcivan19692025tec/chairman/form';
import { LeadershipClientPage } from './LeadershipClientPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rəhbərlik və Komanda',
  description: 'TEC-in sədri və idarə heyətinin üzvləri ilə tanış olun.',
};

async function getTeamMembers(): Promise<TeamMember[]> {
    const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }) as TeamMember);
}

async function getChairman(): Promise<Chairman | null> {
    const docRef = doc(db, "siteContent", "chairman");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Chairman;
    }
    return null;
}

export default async function LeadershipPage() {
    const chairman = await getChairman();
    const teamMembers = await getTeamMembers();

    return <LeadershipClientPage chairman={chairman} boardMembers={teamMembers} />;
}
