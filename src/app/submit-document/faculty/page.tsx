
import type { Metadata } from 'next';
import FacultyDocumentClientPage from './FacultyDocumentClientPage';

export const metadata: Metadata = {
  title: 'Fakültə Sənədləri',
  description: 'Fakültələr üzrə sənədlərin təqdim edilməsi.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FacultyDocumentPage() {
  return <FacultyDocumentClientPage />;
}
