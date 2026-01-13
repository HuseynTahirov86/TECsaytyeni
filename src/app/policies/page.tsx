export default function PoliciesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">
          Siyasətlərimiz
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Məxfilik Siyasəti və İstifadə Şərtləri.
        </p>
      </div>
      <div className="prose prose-lg max-w-none dark:prose-invert space-y-8">
        <div>
          <h2>Məxfilik Siyasəti</h2>
          <p>
            Bu Məxfilik Siyasəti, AzerNews Hub ("biz", "bizim" və ya "sayt") tərəfindən toplanan, istifadə edilən və paylaşılan məlumatların növlərini izah edir. Saytımızdan istifadə etməklə, bu siyasətin şərtlərini qəbul etmiş olursunuz.
          </p>
          <h3>Topladığımız Məlumatlar</h3>
          <p>
            Biz sizin haqqınızda müxtəlif yollarla məlumat toplaya bilərik. Bunlara sizin birbaşa bizə təqdim etdiyiniz məlumatlar (məsələn, qeydiyyat zamanı e-poçt ünvanınız) və saytımızla qarşılıqlı əlaqəniz zamanı avtomatik olaraq toplanan məlumatlar (məsələn, IP ünvanı, brauzer növü) daxildir.
          </p>
          <h3>Məlumatların İstifadəsi</h3>
          <p>
            Topladığımız məlumatlar saytımızı idarə etmək, fərdiləşdirmək, təhlil etmək və təkmilləşdirmək üçün istifadə olunur. Məlumatlarınız heç bir halda sizin icazəniz olmadan üçüncü tərəflərə satılmayacaq və ya icarəyə verilməyəcək.
          </p>
        </div>
        <div>
          <h2>İstifadə Şərtləri</h2>
          <p>
            AzerNews Hub saytına xoş gəlmisiniz. Bu saytdan istifadə etməklə aşağıdakı şərtləri qəbul etmiş olursunuz.
          </p>
          <h3>Məzmun</h3>
          <p>
            Saytımızdakı bütün məzmun (mətnlər, şəkillər, videolar) müəllif hüquqları ilə qorunur. Bizim yazılı icazəmiz olmadan məzmunun hər hansı bir şəkildə kopyalanması, yayılması və ya təkrar istifadəsi qadağandır.
          </p>
          <h3>İstifadəçi Davranışı</h3>
          <p>
            Saytımızın şərh bölmələrində və digər interaktiv hissələrində təhqiramiz, qanunsuz və ya digərlərinin hüquqlarını pozan davranışlara yol verilməməlidir. Bu qaydaları pozan istifadəçilərin sayta girişi məhdudlaşdırıla bilər.
          </p>
        </div>
      </div>
    </div>
  );
}
