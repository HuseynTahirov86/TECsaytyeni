import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bloq',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          Bloq və Xəbərlər
        </h1>
      </header>
      <div className="prose prose-lg max-w-none mx-auto text-center">
        <p>Bu səhifə hazırda hazırlanma mərhələsindədir. Tezliklə burada Şagird Elmi Cəmiyyətinin fəaliyyəti ilə bağlı xəbərlər və məqalələr yerləşdiriləcək.</p>
      </div>
    </div>
  );
}
