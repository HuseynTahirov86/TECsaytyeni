
import type { Metadata } from 'next';
import ProjectsClientPage from './ProjectsClientPage';

export const metadata: Metadata = {
  title: 'Layihələr',
  description: 'NDU TEC üzvləri tərəfindən həyata keçirilən elmi-tədqiqat layihələri, innovativ işlər və araşdırmalar.',
};

export default function ProjectsPage() {
  return <ProjectsClientPage />;
}
