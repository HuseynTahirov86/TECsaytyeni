
import type { Metadata } from 'next';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type JournalArchive } from '@/app/ndutecnaxcivan19692025tec/journal-archive/archive-form';
import ArchiveDisplayClientPage from './ArchiveDisplayClientPage';

type Props = {
  params: { journalType: 'science' | 'law' }
}

async function getJournalArchives(journalType: 'science' | 'law'): Promise<JournalArchive[]> {
    const q = query(
        collection(db, "journalArchives"), 
        where("journalType", "==", journalType)
    );
    const querySnapshot = await getDocs(q);

    const archives = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as JournalArchive;
    });

    // Sort by title in descending order after fetching
    archives.sort((a, b) => b.title.localeCompare(a.title));
    
    return archives;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { journalType } = params;
  const title = journalType === 'science' ? 'Tələbə Elmi Jurnalı' : 'Tələbə Hüquq Jurnalı';

  return {
    title: `${title} - Arxiv`,
    description: `NDU TEC ${title} jurnalının bütün dərc olunmuş buraxılışları.`,
  }
}

export default async function ArchiveDetailPage({ params }: Props) {
  const { journalType } = params;
  
  if (journalType !== 'science' && journalType !== 'law') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Arxiv Tapılmadı</h1>
        <p className="text-muted-foreground mt-2">Yanlış jurnal növü seçilib.</p>
      </div>
    );
  }

  const archives = await getJournalArchives(journalType);
  const title = journalType === 'science' ? 'Tələbə Elmi Jurnalı' : 'Tələbə Hüquq Jurnalı';
  
  return <ArchiveDisplayClientPage archives={archives} title={title} />;
}
