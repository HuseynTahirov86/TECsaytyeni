import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Chairman } from '@/app/ndutecnaxcivan19692025tec/chairman/form';
import { LeadershipClientPage } from './LeadershipClientPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rəhbərlik',
  description: 'TEC-in sədri ilə tanış olun.',
};

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
    return <LeadershipClientPage chairman={chairman} />;
}
