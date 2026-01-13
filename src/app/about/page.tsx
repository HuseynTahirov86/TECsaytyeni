import { Newspaper } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <Newspaper className="h-16 w-16 mb-4 text-primary-foreground" style={{backgroundColor: 'hsl(var(--primary))', padding: '12px', borderRadius: '12px' }}/>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">
          Haqqımızda
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
          AzerNews Hub - Sizin etibarlı xəbər mənbəyiniz.
        </p>
      </div>
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h2>Missiyamız</h2>
        <p>
          Missiyamız, oxucularımıza Azərbaycan və dünya gündəmi haqqında dəqiq, qərəzsiz və vaxtında məlumat təqdim etməkdir. Biz, cəmiyyəti məlumatlandırmaqla daha şəffaf və məlumatlı bir mühit yaratmağa çalışırıq. Jurnalistikanın ən yüksək standartlarına sadiq qalaraq, hadisələri olduğu kimi işıqlandırmağı özümüzə borc bilirik.
        </p>
        <h2>Vizyonumuz</h2>
        <p>
          Vizyonumuz, rəqəmsal mediada innovasiyanın öncüsü olmaq, oxucularımıza ən müasir texnologiyalarla zənginləşdirilmiş, interaktiv və fərdiləşdirilmiş xəbər təcrübəsi yaşatmaqdır. Biz, xəbərin sadəcə oxunmadığı, həm də anlaşıldığı və müzakirə edildiyi bir platforma olmağı hədəfləyirik.
        </p>
        <h2>Dəyərlərimiz</h2>
        <ul>
          <li><strong>Etibarlılıq:</strong> Məlumatlarımızın doğruluğunu təmin etmək üçün bütün mənbələri diqqətlə yoxlayırıq.</li>
          <li><strong>Qərəzsizlik:</strong> Hadisələrə obyektiv yanaşır, bütün tərəflərin mövqeyini əks etdirməyə çalışırıq.</li>
          <li><strong>Şəffaflıq:</strong> Redaksiya siyasətimiz və fəaliyyət prinsiplərimiz barədə oxucularımıza qarşı açıqıq.</li>
          <li><strong>İnnovasiya:</strong> Oxucu təcrübəsini daim yaxşılaşdırmaq üçün yeni texnologiyaları və rəqəmsal alətləri tətbiq edirik.</li>
        </ul>
      </div>
    </div>
  );
}
