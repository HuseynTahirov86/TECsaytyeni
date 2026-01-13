import type { Metadata } from 'next';
import VerifyClientPage from './VerifyClientPage';

export const metadata: Metadata = {
  title: 'Sertifikat Yoxlama',
  description: 'NDU TEC tərəfindən verilən sertifikatların etibarlılığını unikal kod ilə yoxlayın.',
};

export default function VerifyCertificatePage() {
    return <VerifyClientPage />;
}
