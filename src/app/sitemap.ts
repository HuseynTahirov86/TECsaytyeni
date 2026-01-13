import { MetadataRoute } from 'next';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from './ndutecnaxcivan19692025tec/news/news-form';
import { ProjectArticle } from './ndutecnaxcivan19692025tec/projects/project-form';
import { LibraryEntry } from './ndutecnaxcivan19692025tec/library/library-form';

const BASE_URL = 'https://tec.ndu.edu.az';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/trainings',
    '/blog',
    '/library',
    '/journal-archive',
    '/journal-archive/science',
    '/journal-archive/law',
    '/appeal-to-chairman',
    '/contact',
    '/submit-article',
    '/submit-article/science',
    '/submit-article/law',
    '/verify',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic routes
  const [news, projects, library] = await Promise.all([
    getDocs(query(collection(db, 'news'))),
    getDocs(query(collection(db, 'projects'))),
    getDocs(query(collection(db, 'library'))),
  ]);

  const newsRoutes = news.docs.map((doc) => {
    const data = doc.data() as NewsArticle;
    return {
      url: `${BASE_URL}/blog/${data.slug}`,
      lastModified: new Date(data.date).toISOString(),
      priority: 0.7,
    };
  });

  const projectRoutes = projects.docs.map((doc) => {
    const data = doc.data() as ProjectArticle;
    return {
      url: `${BASE_URL}/projects/${data.slug}`,
      lastModified: new Date().toISOString(), // Projects don't have a date field, using current
      priority: 0.7,
    };
  });

  const libraryRoutes = library.docs.map((doc) => {
    const data = doc.data() as LibraryEntry;
    return {
      url: `${BASE_URL}/library/${data.slug}`,
      lastModified: new Date().toISOString(), // Library entries don't have a date field
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...newsRoutes, ...projectRoutes, ...libraryRoutes];
}
