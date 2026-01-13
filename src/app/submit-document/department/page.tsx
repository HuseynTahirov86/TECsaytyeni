
import type { Metadata } from 'next';
import DepartmentDocumentClientPage from './DepartmentDocumentClientPage';

export const metadata: Metadata = {
  title: 'Kafedra Sənədləri',
  description: 'Kafedralar üzrə sənədlərin təqdim edilməsi.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DepartmentDocumentPage() {
  return <DepartmentDocumentClientPage />;
}
