import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TeamMember } from '@/app/ndutecnaxcivan19692025tec/team/team-form';
import { BoardMembersClientPage } from './BoardMembersClientPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'İdarə Heyəti',
  description: 'TEC-in idarə heyətinin üzvləri ilə tanış olun.',
};

async function getTeamMembers(): Promise<TeamMember[]> {
    const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }) as TeamMember);
}

export default async function BoardMembersPage() {
    const boardMembers = await getTeamMembers();
    return <BoardMembersClientPage boardMembers={boardMembers} />;
}
