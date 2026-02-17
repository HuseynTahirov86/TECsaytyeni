import type { Metadata } from 'next';
import SubmitDocumentClientPage from './SubmitDocumentClientPage';

export const metadata: Metadata = {
  title: 'Sənəd Təqdim Et',
  description: 'Fakültə və ya kafedra üzrə rəsmi sənədlərinizi NDU TEC-ə onlayn təqdim edin.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubmitDocumentPage() {
    return <SubmitDocumentClientPage />;
}
