import type { Metadata } from 'next';
import BlogClientPage from './BlogClientPage';

export const metadata: Metadata = {
  title: 'Bloq',
  description: 'ŞEC fəaliyyəti ilə bağlı ən son xəbərlər, elanlar, məqalələr və nailiyyətlərlə tanış olun.',
};

export default function BlogPage() {
  return <BlogClientPage />;
}
