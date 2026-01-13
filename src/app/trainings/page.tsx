import type { Metadata } from 'next';
import TrainingsDashboard from './TrainingsDashboard';

export const metadata: Metadata = {
  title: 'Təlimlər',
  description: 'NDU TEC tərəfindən təşkil olunan onlayn təlimlərə qoşulun, yeni biliklər qazanın və sertifikat əldə edin.',
};

export default function TrainingsPage() {
    return <TrainingsDashboard />;
}
