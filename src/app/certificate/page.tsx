
import type { Metadata } from 'next';
import { Suspense } from 'react';
import CertificateClientPage from './CertificateClientPage';

export const metadata: Metadata = {
    title: 'Sertifikat',
    description: 'NDU TEC tərəfindən verilmiş sertifikatı görüntüləyin və ya yükləyin.',
    robots: {
        index: false,
        follow: false,
    }
};

export default function CertificatePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Sertifikat yüklənir...</div>}>
            <CertificateClientPage />
        </Suspense>
    )
}
