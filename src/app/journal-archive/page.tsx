
import type { Metadata } from 'next';
import ArchiveClientPage from './ArchiveClientPage';

export const metadata: Metadata = {
  title: 'Jurnal Arxivi',
  description: 'NDU TEC-in Tələbə Elmi Jurnalı və Tələbə Hüquq Jurnalının dərc olunmuş buraxılışları.',
};

export default function JournalArchivePage() {
    return <ArchiveClientPage />;
}
