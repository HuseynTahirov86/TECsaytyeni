
import type { Metadata } from 'next';
import LibraryClientPage from './LibraryClientPage';

export const metadata: Metadata = {
  title: 'Elektron Kitabxana',
  description: 'NDU TEC-in elektron kitabxanası. Elmi məqalələr, jurnallar, dərsliklər və kitablar toplusunu kəşf edin.',
};

export default function LibraryPage() {
  return <LibraryClientPage />;
}
