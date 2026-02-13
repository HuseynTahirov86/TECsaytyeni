import type { Metadata } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FormerChairman } from '@/app/ndutecnaxcivan19692025tec/formers/former-chairman-form';
import { FormerChairmenClientPage } from './FormerChairmenClientPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sabiq Sədrlər',
  description: 'TEC-in inkişafına töhfə vermiş keçmiş sədrlər.',
};

async function getFormerChairmen(): Promise<FormerChairman[]> {
    const q = query(collection(db, "formerChairmen"), orderBy("period", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }) as FormerChairman);
}

export default async function FormerChairmenPage() {
    const formerChairmen = await getFormerChairmen();
    return <FormerChairmenClientPage formerChairmen={formerChairmen} />;
}
