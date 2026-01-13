import { Bug, Briefcase, Film, Landmark, Rocket, Trophy, type LucideIcon } from "lucide-react";

export type Category = {
  name: string;
  slug: string;
  icon: LucideIcon;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  date: string;
  category: string;
  imageId: string;
  featured?: boolean;
};

export type User = {
    id: string;
    name: string;
    email: string;
    avatarId: string;
}

export type Comment = {
    id: string;
    articleSlug: string;
    userId: string;
    content: string;
    date: string;
}

const categories: Category[] = [
  { name: 'Texnologiya', slug: 'technology', icon: Rocket },
  { name: 'İdman', slug: 'sports', icon: Trophy },
  { name: 'Siyasət', slug: 'politics', icon: Landmark },
  { name: 'Mədəniyyət', slug: 'culture', icon: Film },
  { name: 'Biznes', slug: 'business', icon: Briefcase },
];

const users: User[] = [
    { id: 'user-1', name: 'Ayxan Əhmədov', email: 'ayxan@example.com', avatarId: 'user-avatar-1' },
    { id: 'user-2', name: 'Leyla Məmmədova', email: 'leyla@example.com', avatarId: 'user-avatar-2' },
    { id: 'user-3', name: 'Rəşad Quliyev', email: 'reshad@example.com', avatarId: 'user-avatar-3' },
    { id: 'user-4', name: 'New User', email: 'new@example.com', avatarId: 'user-avatar-4' },
];

const articles: Article[] = [
  {
    slug: 'ai-future-of-everything',
    title: 'Süni İntellekt: Hər Şeyin Gələcəyi',
    excerpt: 'Süni intellektin cəmiyyətimizə və iqtisadiyyatımıza təsirlərini dərindən araşdırırıq. Bu texnologiya həyatımızı necə dəyişəcək?',
    content: `Süni intellekt (Sİ) son illərdə texnologiya dünyasının ən çox müzakirə olunan mövzularından birinə çevrilib. Maşın öyrənməsi, dərin öyrənmə və neyron şəbəkələr kimi alt sahələri ilə Sİ, kompüterlərə insanabənzər zəka nümayiş etdirməyə imkan verir. Bu, səhiyyədən maliyyəyə, nəqliyyatdan əyləncəyə qədər bir çox sektorda inqilabi dəyişikliklərə səbəb olur. Həkimlərə diaqnoz qoymaqda kömək edən alqoritmlər, sürücüsüz avtomobillər və fərdiləşdirilmiş məzmun təklif edən axın platformaları Sİ-nin gündəlik həyatımıza artıq necə inteqrasiya olunduğunun yalnız bir neçə nümunəsidir. Ancaq bu sürətli inkişaf eyni zamanda etik sualları və potensial riskləri də gündəmə gətirir. Məlumatların məxfiliyi, iş yerlərinin avtomatlaşdırılması və alqoritmik qərəzlilik kimi məsələlər cəmiyyət olaraq üzləşməli olduğumuz vacib problemlərdir. Sİ-nin gələcəyi, bu texnologiyanı necə inkişaf etdirdiyimizdən və cəmiyyətə necə inteqrasiya etdiyimizdən asılı olacaq. Potensial faydaları maksimallaşdırarkən riskləri minimuma endirmək üçün diqqətli planlaşdırma və tənzimləmə tələb olunur.`,
    author: 'Ayxan Əhmədov',
    authorId: 'user-1',
    date: '2024-05-20',
    category: 'technology',
    imageId: 'article-thumb-tech-1',
    featured: true,
  },
  {
    slug: 'championship-final-results',
    title: 'Böyük Final: Çempionluq Yarışının Nəticələri',
    excerpt: 'Gərgin keçən mövsümün finalında favorit komanda rəqibini məğlub edərək çempionluq kubokunu başı üzərinə qaldırdı.',
    content: `İdman dünyası aylardır nəfəsini tutaraq izlədiyi çempionluq finalı ilə çalxalandı. Mövsüm boyunca göstərdikləri üstün performansla diqqət çəkən iki nəhəng komanda, tarixin ən yaddaqalan finallarından birinə imza atdı. Gərgin mübarizənin ilk dəqiqələrindən etibarən hər iki tərəf qalibiyyət üçün bütün gücünü ortaya qoydu. Matçın ilk hissəsi qarşılıqlı hücumlarla keçsə də, hesab açılmadı. İkinci hissədə isə taktiki dəyişikliklər və oyunçu əvəzləmələri matçın taleyini həll etdi. Oyunun son dəqiqələrində vurulan qolla favorit komanda 1-0 önə keçdi və bu üstünlüyünü matçın sonuna qədər qorumağı bacardı. Final fitinin səslənməsi ilə birlikdə minlərlə azarkeş böyük sevinc yaşadı və komandaları ilə birlikdə bu tarixi qələbəni qeyd etdi. Bu nəticə ilə komanda həm liqa çempionluğunu qazandı, həm də gələn mövsüm üçün beynəlxalq turnirlərdə iştirak etmək hüququ əldə etdi.`,
    author: 'Leyla Məmmədova',
    authorId: 'user-2',
    date: '2024-05-19',
    category: 'sports',
    imageId: 'article-thumb-sports-1',
    featured: true,
  },
  {
    slug: 'global-economic-outlook-2024',
    title: '2024 üçün Qlobal İqtisadi Proqnozlar',
    excerpt: 'Beynəlxalq Valyuta Fondu qlobal iqtisadi artım proqnozlarını yenilədi. İnflyasiya və geosiyasi risklər əsas çağırışlar olaraq qalır.',
    content: `Dünya iqtisadiyyatı, pandemiyanın ardından başlayan bərpa prosesində yeni çətinliklərlə üzləşir. Yüksək inflyasiya, enerji qiymətlərindəki dalğalanmalar və davam edən geosiyasi gərginliklər qlobal artım tempinə mənfi təsir göstərir. Beynəlxalq maliyyə qurumları, 2024-cü il üçün artım proqnozlarını bir qədər aşağı salaraq, qeyri-müəyyənliyin davam etdiyini vurğulayır. Mərkəzi bankların faiz artımı siyasətləri inflyasiyanı cilovlamaq məqsədi daşısa da, bu, eyni zamanda iqtisadi aktivliyi yavaşlada bilər. İnkişaf etməkdə olan ölkələr xüsusilə yüksək borclanma xərcləri və valyuta məzənnələrindəki dəyişkənlikdən əziyyət çəkir. Ekspertlər, qlobal ticarətdəki zəifləmənin və tədarük zəncirlərindəki problemlərin həlli üçün beynəlxalq əməkdaşlığın vacibliyini qeyd edirlər. Gələcək aylarda iqtisadi siyasətçilərin atacağı addımlar, qlobal iqtisadiyyatın istiqamətini müəyyən etməkdə həlledici rol oynayacaq.`,
    author: 'Rəşad Quliyev',
    authorId: 'user-3',
    date: '2024-05-18',
    category: 'business',
    imageId: 'article-thumb-business-1',
    featured: true,
  },
  {
    slug: 'new-election-reforms-passed',
    title: 'Yeni Seçki İslahatları Qəbul Edildi',
    excerpt: 'Parlament, seçki prosesində şəffaflığı artırmaq məqsədi daşıyan yeni qanun layihəsini təsdiqlədi.',
    content: `Uzun sürən müzakirələrdən sonra parlament, seçki sistemində köklü dəyişiklikləri nəzərdə tutan yeni islahatlar paketini qəbul etdi. Yeni qanunvericilik, seçki prosesinin bütün mərhələlərində şəffaflığı və hesabatlılığı artırmağı hədəfləyir. Əsas dəyişikliklər arasında seçici siyahılarının yenilənməsi, səsvermə prosesinin rəqəmsal müşahidəsi və seçki komissiyalarının tərkibində müstəqil üzvlərin sayının artırılması yer alır. Hökumət nümayəndələri bu islahatların demokratik prinsiplərə uyğunluğu gücləndirəcəyini və vətəndaşların seçki prosesinə olan etimadını artıracağını bildirir. Müxalifət partiyaları isə bəzi maddələrlə bağlı narahatlıqlarını ifadə etsələr də, ümumilikdə islahatların müsbət addım olduğunu qeyd edirlər. Beynəlxalq müşahidəçilər də yeni qanunun tətbiqini yaxından izləyəcəklərini və növbəti seçkilərdə onun effektivliyini qiymətləndirəcəklərini açıqlayıblar.`,
    author: 'Ayxan Əhmədov',
    authorId: 'user-1',
    date: '2024-05-17',
    category: 'politics',
    imageId: 'article-thumb-politics-1',
  },
   {
    slug: 'quantum-computing-breakthrough',
    title: 'Kvant Kompüterlərində Yeni İnqilab',
    excerpt: 'Alimlər, kvant kompüterlərinin hesablamasını sürətləndirən və sabitliyini artıran yeni bir alqoritm kəşf etdilər.',
    content: 'Fizika və kompüter elmləri sahəsində çalışan beynəlxalq bir araşdırma qrupu, kvant kompüterlərinin inkişafında mühüm bir irəliləyişə imza atdı. Onların təqdim etdiyi yeni alqoritm, "kvant dolaşıqlığı" fenomenindən daha səmərəli istifadə edərək mürəkkəb hesablamaları əvvəlkindən qat-qat daha sürətli aparmağa imkan verir. Bu kəşf, xüsusilə dərman dizaynı, materialşünaslıq və maliyyə modelləşdirməsi kimi sahələrdə həll edilməsi mümkün olmayan problemlərin qapısını aça bilər. Araşdırmanın rəhbəri Dr. Elara Vance, "Bu, sadəcə sürət artımı deyil, bu, kvant hesablamalarının etibarlılığı və sabitliyi üçün də böyük bir addımdır" dedi. Kvant üstünlüyünə çatmaq üçün hələ uzun bir yol olsa da, bu yeni alqoritm gələcəyin super kompüterlərinin potensialını bir daha gözlər önünə sərir və bu sahəyə olan marağı daha da artırır.',
    author: 'Leyla Məmmədova',
    authorId: 'user-2',
    date: '2024-05-16',
    category: 'technology',
    imageId: 'article-thumb-tech-2',
  },
  {
    slug: 'film-festival-winners-announced',
    title: 'Beynəlxalq Film Festivalının Qalibləri Açıqlandı',
    excerpt: 'Bu ilki film festivalında "Qızıl Palma" mükafatı, cəsur sosial tənqidi ilə seçilən "Səssiz Divarlar" filminə təqdim edildi.',
    content: 'Dünyanın ən prestijli kino hadisələrindən sayılan Beynəlxalq Film Festivalı, möhtəşəm bir mükafatlandırma mərasimi ilə başa çatdı. On gün davam edən festival boyunca müxtəlif ölkələrdən onlarla film nümayiş olundu. Münsiflər heyətinin uzun müzakirələrindən sonra əsas mükafat olan "Qızıl Palma"ya, müasir cəmiyyətin yadlaşma probleminə toxunan "Səssiz Divarlar" filmi layiq görüldü. Filmin rejissoru mükafatı alarkən etdiyi çıxışında, "Bu mükafatı səsi eşidilməyən milyonlarla insana həsr edirəm" dedi. "Ən Yaxşı Rejissor" mükafatı vizual dili ilə fərqlənən bir tarixi dramın yaradıcısına, "Ən Yaxşı Aktyor" və "Aktrisa" mükafatları isə unudulmaz performansları ilə yadda qalan iki sənətçiyə verildi. Festival, dünya kinosunun yeni istedadlarını kəşf etmək və fərqli mədəniyyətlər arasında dialoq qurmaq missiyasını bu il də uğurla yerinə yetirdi.',
    author: 'Rəşad Quliyev',
    authorId: 'user-3',
    date: '2024-05-15',
    category: 'culture',
    imageId: 'article-thumb-culture-1',
  },
];

const comments: Comment[] = [
    { id: 'comment-1', articleSlug: 'ai-future-of-everything', userId: 'user-2', content: 'Çox maraqlı məqalədir. Süni intellektin gələcəyi həqiqətən də həm həyəcanverici, həm də bir az qorxuducudur.', date: '2024-05-21' },
    { id: 'comment-2', articleSlug: 'ai-future-of-everything', userId: 'user-3', content: 'Razıyam. Xüsusilə etik məsələlər və iş yerlərinin avtomatlaşdırılması ciddi şəkildə nəzərə alınmalıdır.', date: '2024-05-21' },
    { id: 'comment-3', articleSlug: 'championship-final-results', userId: 'user-1', content: 'İnanılmaz oyun oldu! Son dəqiqə qolu həqiqətən həyəcanlı idi. Komandamı təbrik edirəm!', date: '2024-05-20' },
];


export const getCategories = () => categories;
export const getArticles = () => articles;
export const getFeaturedArticles = () => articles.filter(a => a.featured);
export const getArticleBySlug = (slug: string) => articles.find(a => a.slug === slug);
export const getArticlesByCategory = (categorySlug: string) => articles.filter(a => a.category === categorySlug);
export const getCommentsByArticle = (articleSlug: string) => comments.filter(c => c.articleSlug === articleSlug);
export const getUsers = () => users;
export const getUserById = (userId: string) => users.find(u => u.id === userId);
