import type { Metadata } from 'next';
import SubmitScienceArticleClientPage from './SubmitScienceArticleClientPage';

export const metadata: Metadata = {
    title: 'Tələbə Elmi Jurnalına Məqalə Göndər',
    description: 'Ümumi elmi və fənlərarası tədqiqatlarınızı Naxçıvan Dövlət Universitetinin Tələbə Elmi Jurnalında dərc üçün təqdim edin.',
    openGraph: {
        title: 'Tələbə Elmi Jurnalı | Məqalə Qəbulu',
        description: 'Elmi fikirlərinizi, tədqiqatlarınızı və ya kəşflərinizi TEC icması ilə paylaşın.'
    }
};

export default function SubmitScienceArticlePage() {
    return <SubmitScienceArticleClientPage />;
}
