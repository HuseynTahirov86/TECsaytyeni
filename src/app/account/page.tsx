
import type { Metadata } from 'next';
import { Suspense } from 'react';
import AccountPageContent from './AccountPageContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Şəxsi Kabinet',
    description: 'Şəxsi məlumatlarınıza baxın, tamamladığınız təlimləri və sertifikatlarınızı idarə edin.',
    robots: {
        index: false,
        follow: false,
    }
};

export default function AccountPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Yüklənir...</div>}>
            <AccountPageContent />
        </Suspense>
    );
}
