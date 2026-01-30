import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sədrə Müraciət',
};

export default function AppealPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          ŞEC Sədrinə Müraciət
        </h1>
      </header>
      <div className="prose prose-lg max-w-none mx-auto text-center">
        <p>Bu səhifə hazırda hazırlanma mərhələsindədir. Tezliklə burada ŞEC sədrinə müraciət etmək üçün elektron forma yerləşdiriləcək.</p>
      </div>
    </div>
  );
}
