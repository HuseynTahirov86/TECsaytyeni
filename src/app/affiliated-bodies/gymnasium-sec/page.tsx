import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gimnaziya Şagird Elmi Cəmiyyəti',
  description: 'Naxçıvan Dövlət Universiteti nəzdində Gimnaziyanın Şagird Elmi Cəmiyyətinin fəaliyyəti, layihələri və tədbirləri.',
};

export default function GymnasiumSECPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          NDU nəzdində Gimnaziyanın Şagird Elmi Cəmiyyəti
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Gənc tədqiqatçıların elmə atdığı ilk addımlar.
        </p>
      </header>
      <div className="prose prose-lg max-w-none mx-auto text-center">
        <p>Bu səhifə hazırda hazırlanma mərhələsindədir. Tezliklə burada Gimnaziya Şagird Elmi Cəmiyyəti haqqında ətraflı məlumat yerləşdiriləcək.</p>
      </div>
    </div>
  );
}
