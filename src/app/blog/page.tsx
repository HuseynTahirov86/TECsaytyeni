
import type { Metadata } from 'next';
import BlogClientPage from './BlogClientPage';

export const metadata: Metadata = {
  title: 'Xəbərlər & Bloq',
  description: 'TEC-in fəaliyyəti ilə bağlı ən son xəbərlər, elanlar, məqalələr və nailiyyətlərlə tanış olun.',
};

export default function BlogPage() {
  return <BlogClientPage />;
}
