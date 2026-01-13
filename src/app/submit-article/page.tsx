import type { Metadata } from 'next';
import ChooseJournalPage from './ChooseJournalPage';

export const metadata: Metadata = {
  title: 'Məqalə Göndər',
  description: 'Elmi məqalələrinizi və tədqiqatlarınızı NDU TEC-in elmi və ya hüquq jurnallarında dərc üçün təqdim edin.',
};

export default function SubmitArticlePage() {
    return <ChooseJournalPage />;
}
