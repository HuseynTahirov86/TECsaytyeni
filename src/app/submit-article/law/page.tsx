import type { Metadata } from 'next';
import SubmitLawArticleClientPage from './SubmitLawArticleClientPage';

export const metadata: Metadata = {
    title: 'Tələbə Hüquq Jurnalına Məqalə Göndər',
    description: 'Hüquq sahəsinə aid tədqiqatlarınızı və məqalələrinizi Naxçıvan Dövlət Universitetinin Tələbə Hüquq Jurnalında dərc üçün təqdim edin.',
    openGraph: {
        title: 'Tələbə Hüquq Jurnalı | Məqalə Qəbulu',
        description: 'Qeydiyyat üçün son tarix: 01.11.2025'
    }
};

export default function SubmitLawArticlePage() {
    return <SubmitLawArticleClientPage />;
}
