
import type { Metadata } from 'next';
import AppealClientPage from './AppealClientPage';

export const metadata: Metadata = {
  title: 'Sədrə Müraciət',
  description: 'Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyəti sədrinə sual, təklif və ya şikayətlərinizi elektron formada göndərin.',
};

export default function AppealToChairmanPage() {
  return <AppealClientPage />;
}
