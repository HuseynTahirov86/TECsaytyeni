import type { Metadata } from 'next';
import ContactClientPage from './ContactClientPage';

export const metadata: Metadata = {
  title: 'Əlaqə',
  description: 'NDU TEC ilə əlaqə saxlayın. Suallarınız, təklifləriniz və ya əməkdaşlıq üçün bizə yazın.',
};

export default function ContactPage() {
  return <ContactClientPage />;
}
